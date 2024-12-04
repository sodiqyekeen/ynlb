import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from "../components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Progress } from "../components/ui/Progress"
import { ScrollArea } from "../components/ui/ScrollArea"
import { Loader2, Download, Upload, Trash2 } from 'lucide-react'
import ExcelJS from 'exceljs'
import { Slider } from "../components/ui/Slider"
import { WorkerContainer } from '@/lib/workerContainer'

interface TranslationItem {
    english: string
    yoruba: string
    status: 'pending' | 'translating' | 'completed'
}

export default function BulkTranslation() {
    const [translations, setTranslations] = useState<TranslationItem[]>([])
    const [isTranslating, setIsTranslating] = useState(false)
    const [progress, setProgress] = useState(0)
    const workers = useRef<WorkerContainer[]>([])
    const [workerCount, setWorkerCount] = useState(1)
    const translationQueue = useRef<number[]>([]);


    useEffect(() => {
        for (let i = 0; i < workerCount; i++) {
            const worker = new WorkerContainer()
            workers.current.push(worker)
        }
        const onmessage = (messageData: any, worker: WorkerContainer) => {
            const { data, index } = messageData
            setTranslations(prev => prev.map((item, i) => i === index ? { ...item, yoruba: data, status: 'completed' } : item))
            setProgress((prev) => prev + 100 / translations.length)
            const nextIndex = translationQueue.current.shift()
            if (nextIndex !== undefined) {
                const nextItem = translations[nextIndex]
                worker.sendMessage({ text: nextItem.english, index: nextIndex })
            }
            else {
                setIsTranslating(false)
            }
        }

        workers.current.forEach(worker => worker.registerMessageHandler('completed', onmessage))
        return () => {
            workers.current.forEach(worker => worker.terminate())
            workers.current = []
        }
    }, [workerCount, translations.length])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            translationQueue.current = []
            setTranslations([])
            setIsTranslating(false)
            setProgress(0)
            if (file.type !== 'text/plain') {
                alert('Please upload a valid .txt file')
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                const lines = content.split('\n').filter(line => line.trim() !== '')
                const uniqueLines = Array.from(new Set(lines))
                const newTranslations = uniqueLines.map(line => ({
                    english: line.trim(),
                    yoruba: '',
                    status: 'pending' as const
                }))
                setTranslations(newTranslations)
                event.target.value = ''
            }
            reader.readAsText(file)
        }
    }

    const translateAll = useCallback(() => {
        setIsTranslating(true)
        setProgress(0)
        translationQueue.current = []
        translations.forEach((_, index) => translationQueue.current.push(index))
        workers.current.forEach(worker => {
            const nextIndex = translationQueue.current.shift();
            if (nextIndex !== undefined) {
                const nextItem = translations[nextIndex];
                worker.sendMessage({ text: nextItem.english, index: nextIndex });
            }
        })

    }, [translations, workerCount])

    const downloadReport = useCallback(async () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Translation Report')

        worksheet.columns = [
            { header: 'English', key: 'english', width: 50 },
            { header: 'Yoruba', key: 'yoruba', width: 50 },
        ]

        translations.forEach(item => {
            worksheet.addRow({
                english: item.english,
                yoruba: item.yoruba,
            })
        })

        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'translation_report.xlsx'
        a.click()
        URL.revokeObjectURL(url)
    }, [translations])

    const deleteTranslation = (index: number) => {
        setTranslations(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-4 pr-4">
            <h2 className="text-2xl font-semibold text-gray-800">Bulk Translation</h2>
            <div className="flex items-center space-x-4">
                {!isTranslating && (
                    <>
                        <Button
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                        </Button>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".txt"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </>
                )}
                {translations.length > 0 && (
                    <Button
                        onClick={translateAll}
                        disabled={isTranslating}
                        className="bg-zinc-800 hover:bg-zinc-900 text-white"
                    >
                        {isTranslating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Translating...
                            </>
                        ) : (
                            'Translate All'
                        )}
                    </Button>
                )}
                {translations.length > 0 && !translations.some(t => t.status !== 'completed') && (
                    <Button
                        onClick={downloadReport}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                )}
            </div>
            {translations.length > 0 && translationQueue.current.length === 0 && (
                <div className="mt-4">
                    <label htmlFor="worker-count" className="block text-sm font-medium text-gray-700">Number of Workers</label>
                    <Slider
                        id="worker-count"
                        min={1}
                        max={10}
                        value={workerCount}
                        onChange={setWorkerCount}
                        className="mt-2"
                    />
                    <p className="text-sm text-gray-600 mt-2">Workers: {workerCount}</p>
                </div>
            )}
            {isTranslating && (
                <div className="mt-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-600 mt-2">Translating: {Math.round(progress)}% complete</p>
                </div>
            )}
            {translations.length > 0 && (
                <ScrollArea className="h-[calc(100vh-10rem)] mt-6 bg-white rounded-lg shadow-md p-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/2">English</TableHead>
                                    <TableHead className="w-1/2">Yoruba</TableHead>
                                    <TableHead>Status</TableHead>
                                    {translations.every(t => t.status === 'completed') && <TableHead>Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {translations.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.english}</TableCell>
                                        <TableCell>{item.yoruba}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'translating' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        {translations.every(t => t.status === 'completed') && (
                                            <TableCell>
                                                {item.status === 'completed' && (
                                                    <button
                                                        onClick={() => deleteTranslation(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
            )}
        </div>
    )
}