import React, { useEffect, useRef, useState } from 'react'
import { Copy, Loader2, XCircle } from 'lucide-react'
import { Button } from "../components/ui/Button"
import { Textarea } from "../components/ui/TextArea";
import { ScrollArea } from "../components/ui/ScrollArea";
import { useToast } from "../components/useToast";
import { Progress } from '@/components/ui/Progress';
import { TranslationItem, TranslationHistory } from '@/components/TranslationHistory';
import { v4 as uuid } from 'uuid';
import { useLocation } from 'react-router-dom';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function TranslatePage() {
    const [inputText, setInputText] = useState<string>('')
    const [outputText, setOutputText] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [progressItems, setProgressItems] = useState<{ file: string, progress: number }[]>([]);
    const [history, setHistory] = useState<TranslationItem[]>([])
    const { toast } = useToast()

    const worker = useRef<Worker | null>(null);
    const inputTextRef = useRef<string>('');
    const location = useLocation();
    const streamingAbortController = useRef<AbortController | null>(null);
    const remainingTextRef = useRef<string>('');

    useEffect(() => {
        if (location.state && location.state.sharedText) {
            setInputText(location.state.sharedText as string)
            handleTranslate();
        }
    }, [location]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('translationHistory')
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('translationHistory', JSON.stringify(history))
    }, [history]);

    useEffect(() => {
        inputTextRef.current = inputText;
    }, [inputText]);

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../workers/translatorWorker.ts', import.meta.url), { type: 'module' });
        }

        const onmessage = async (event: MessageEvent) => {
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
                case 'update':
                    if (streamingAbortController.current) {
                        streamingAbortController.current.abort();
                        remainingTextRef.current = outputText ? ' ' + data : data;
                    } else {
                        remainingTextRef.current = outputText ? remainingTextRef.current + ' ' + data : data;
                    }

                    streamingAbortController.current = new AbortController();
                    const signal = streamingAbortController.current.signal;

                    const words = remainingTextRef.current.split('');

                    let newText = '';
                    for (const char of words) {
                        if (signal.aborted) {
                            break;
                        }
                        await delay(50);
                        newText += char;
                        setOutputText(prev => prev + char);
                    }
                    remainingTextRef.current = '';
                    break;
                case 'completed':
                    setOutputText(data);
                    setIsLoading(false);
                    const newItem: TranslationItem = {
                        id: uuid(),
                        english: inputTextRef.current,
                        yoruba: data,
                        timestamp: new Date()
                    };
                    setHistory(prevHistory => [newItem, ...prevHistory]);
                    break;
                default:
                    break
            };
        };

        worker.current.addEventListener('message', onmessage);
        return () => {
            worker.current?.removeEventListener('message', onmessage);
        };
    }, [outputText]);

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
            worker.current?.postMessage({ text: inputText });
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

    const handleDeleteHistoryItem = (id: string) => {
        setHistory(prevHistory => prevHistory.filter(item => item.id !== id))
    }

    const handleClearHistory = () => {
        setHistory([])
    }

    const handleItemSelected = (id: string) => {
        const item = history.find(item => item.id === id);
        if (item) {
            setInputText(item.english);
            setOutputText(item.yoruba);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-grow md:max-w-[calc(100%-25rem)]">
                <ScrollArea className="h-full">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">English to Yorùbá Translation</h2>
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
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Yorùbá Translation</h3>
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
            </div>
            {history.length > 0 && (
                <div className="mt-8 lg:mt-0 lg:w-96 ">
                    <TranslationHistory
                        history={history}
                        onDeleteItem={handleDeleteHistoryItem}
                        onClearAll={handleClearHistory}
                        onSelectItem={handleItemSelected}
                    />
                </div>
            )}
        </div>
    )
}

