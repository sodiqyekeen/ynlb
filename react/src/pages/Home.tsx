import React, { useEffect, useRef, useState } from 'react'
import { Copy, Loader2, XCircle } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { ScrollArea } from "../components/ui/scroll-area"
import { useToast } from "../components/use-toast"
import { Progress } from '@/components/ui/progress'

export default function TranslatePage() {
    const [inputText, setInputText] = useState<string>('')
    const [outputText, setOutputText] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [progressItems, setProgressItems] = useState<{ file: string, progress: number }[]>([]);
    const { toast } = useToast()

    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../workers/translatorWorker.ts', import.meta.url), { type: 'module' });
        }

        const onmessage = (event: MessageEvent) => {
            const { type, data } = event.data;
            switch (type) {
                case 'initiate':
                    setProgressItems(prevItems => [...prevItems, { file: data.file, progress: 0 }]);
                    break;
                case 'progress':
                    setProgressItems(prevItems =>
                        prevItems.map(item => item.file === data.file ? { ...item, progress: data.progress } : item)
                    );
                    break;
                case 'done':
                    setProgressItems(prevItems => prevItems.filter(item => item.file !== data.file));
                    break;
                case 'translating':
                    setOutputText(data);
                    break;
                case 'completed':
                    setOutputText(data);
                    setIsLoading(false);
                    break;
                default:
                    break
            };
        };

        worker.current.addEventListener('message', onmessage);
        return () => {
            worker.current?.removeEventListener('message', onmessage);
        };
    }, []);

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text to translate.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        setOutputText('')
        try {
            worker.current?.postMessage(inputText);
        } catch (error) {
            toast({
                title: "Translation Error",
                description: "An error occurred while translating. Please try again.",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputText)
        toast({
            title: "Copied!",
            description: "Translation copied to clipboard.",
            variant: "default",
        })
    }

    const clearInputText = () => {
        setInputText('');
    }

    return (
        <ScrollArea className="h-full">
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">English to Yoruba Translation</h2>
                <div className="relative">
                    <Textarea
                        placeholder="Enter English text here"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full min-h-[120px] bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                    {inputText && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-2 transform -translate-y-1/2"
                            onClick={clearInputText}
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Button
                    onClick={handleTranslate}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Translating...
                        </>
                    ) : (
                        'Translate'
                    )}
                </Button>
                {progressItems.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Model Loading</h3>
                        <ul>
                            {progressItems.map((item, index) => (
                                <Progress key={index} value={item.progress} text={item.file} className='my-2' />
                            ))}
                        </ul>
                    </div>
                )}
                {outputText && (
                    <div className="mt-6 bg-white rounded-lg shadow-md p-4 relative">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Yoruba Translation</h3>
                        <p className="text-gray-700">{outputText}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={copyToClipboard}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </section>
        </ScrollArea>
    )
}

