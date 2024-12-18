import React, { useEffect, useRef } from 'react'
import { ScrollArea } from "./ui/ScrollArea"
import { Button } from "./ui/Button"
import { Trash2, XCircle, Download } from 'lucide-react'
import ExcelJS from 'exceljs'


export interface TranslationItem {
    id: string
    english: string
    yoruba: string
    timestamp: Date
}

interface TranslationHistoryProps {
    history: TranslationItem[]
    onDeleteItem: (id: string) => void
    onClearAll: () => void
    onSelectItem: (id: string) => void
}
export function TranslationHistory({ history, onDeleteItem, onClearAll, onSelectItem }: TranslationHistoryProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            const scrollArea = scrollRef.current
            if (scrollArea) {
                const { scrollTop, scrollHeight, clientHeight } = scrollArea
                const topFade = scrollArea.querySelector('.top-fade') as HTMLElement
                const bottomFade = scrollArea.querySelector('.bottom-fade') as HTMLElement

                if (topFade) {
                    topFade.style.opacity = scrollTop > 0 ? '1' : '0'
                }
                if (bottomFade) {
                    bottomFade.style.opacity = scrollTop + clientHeight < scrollHeight ? '1' : '0'
                }
            }
        }

        const scrollArea = scrollRef.current
        if (scrollArea) {
            scrollArea.addEventListener('scroll', handleScroll)
            handleScroll()
        }

        return () => {
            if (scrollArea) {
                scrollArea.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Translation History')

        worksheet.columns = [
            { header: 'English', key: 'english', width: 50 },
            { header: 'Yorùbá', key: 'yoruba', width: 50 },
        ]

        history.forEach(item => {
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
        a.download = 'translation_history.xlsx'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full md:w-96 md:fixed md:right-4 md:top-20 md:bottom-4 md:overflow-hidden  p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">History</h2>
                <div className="flex gap-2">
                    <Button
                        onClick={handleExport}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button
                        onClick={onClearAll}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                </div>
            </div>
            <div className="relative">
                <div className="top-fade absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none opacity-0 transition-opacity duration-300"></div>
                <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)]" ref={scrollRef}>
                    {
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="mb-4 p-3 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors duration-200 lg:max-w-3xs md:max-w-xs sm:max-w-2xl max-w-xs"
                                onClick={() => onSelectItem(item.id)}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-600 truncate">{item.english}</p>
                                        <p className="text-sm font-medium mt-1 truncate">{item.yoruba}</p>
                                    </div>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDeleteItem(item.id)
                                        }}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-red-600 flex-shrink-0 -mt-1 -mr-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(item.timestamp).toLocaleString()}
                                </p>
                            </div>
                        ))
                    }
                </ScrollArea>
                <div className="bottom-fade absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none opacity-0 transition-opacity duration-300"></div>
            </div>
        </div>
    )
}