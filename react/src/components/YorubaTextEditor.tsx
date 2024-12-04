import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from "./ui/Button"
import { Textarea } from "./ui/TextArea"
import { ScrollArea } from "./ui/ScrollArea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/Dialog"
import { Settings, Copy, Keyboard } from 'lucide-react'

const yorubaCharMap: { [key: string]: string[] } = {
    a: ['a', 'à', 'á', 'ã', 'â'],
    e: ['e', 'è', 'é', 'ẽ', 'ê'],
    i: ['i', 'ì', 'í', 'ĩ', 'î'],
    o: ['o', 'ò', 'ó', 'õ', 'ô'],
    u: ['u', 'ù', 'ú', 'ũ', 'û'],
    n: ['n', 'ń', 'ǹ'],
    s: ['s', 'ṣ']
};

export default function YorubaTextEditor() {
    const [showInstructions, setShowInstructions] = useState(false)
    const [text, setText] = useState<string>('');
    const [showVariants, setShowVariants] = useState<{ char: string, position: { x: number, y: number } } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const key = e.key.toLowerCase();
        if (yorubaCharMap[key]) {
            e.preventDefault(); // Prevent default behavior
            if (!holdTimeout) {
                const timeout = setTimeout(() => {
                    if (textareaRef.current && document.activeElement === textareaRef.current) {
                        const rect = textareaRef.current.getBoundingClientRect();
                        const start = textareaRef.current.selectionStart!;
                        const x = rect.left + (start * 8); // Adjust the position calculation as needed
                        const y = rect.top + 20; // Adjust the position calculation as needed
                        setShowVariants({
                            char: key,
                            position: { x, y }
                        });
                    }
                }, 200); // Adjust the delay as needed
                setHoldTimeout(timeout);
            }
        } else if (showVariants) {
            setShowVariants(null);
        }
    }, [holdTimeout, showVariants]);

    const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const key = e.key.toLowerCase();
        if (yorubaCharMap[key]) {
            if (holdTimeout) {
                clearTimeout(holdTimeout);
                setHoldTimeout(null);
                if (!showVariants) {
                    setText(prevText => prevText + key);
                }
            }
        }
    }, [holdTimeout, showVariants]);

    const insertAtCursor = (variant: string) => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart!;
            const end = textareaRef.current.selectionEnd!;
            const newText = text.slice(0, start) + variant + text.slice(end);
            setText(newText);
            setShowVariants(null);
            textareaRef.current.focus(); // Ensure the textarea remains focused
            setTimeout(() => {
                textareaRef.current!.setSelectionRange(start + variant.length, start + variant.length); // Move cursor to the end of the inserted character
            }, 0);
        }
    };

    const handleVariantClick = (variant: string) => {
        insertAtCursor(variant);
    };

    const copyText = () => {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard')
                // You can add a toast notification here
            })
            .catch(err => {
                console.error('Failed to copy text: ', err)
            })
    }


    useEffect(() => {
        // Show instructions by default when the component mounts
        setShowInstructions(true)

        const handleClickOutside = (event: MouseEvent) => {
            if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
                setShowVariants(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Yoruba Text Editor</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Keyboard className="w-4 h-4 mr-2" />
                            Typing Instructions
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Yoruba Typing Instructions</DialogTitle>
                            <DialogDescription>
                                How to type Yoruba characters with diacritics:
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[300px] w-full pr-4">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Use [ for low tone (e.g., è, ò)</li>
                                <li>Use ] for high tone (e.g., é, ó)</li>
                                <li>Use Option (Alt) for bottom sign (e.g., ẹ, ọ, ṣ)</li>
                                <li>Combine Option (Alt) with [ or ] for bottom sign with tone (e.g., ẹ̀, ọ́)</li>
                                <li>Use Shift or Caps Lock for uppercase letters</li>
                            </ul>
                            <div className="mt-4">
                                <h4 className="font-semibold">Examples:</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>e + [ = è</li>
                                    <li>e + ] = é</li>
                                    <li>e + Option (Alt) = ẹ</li>
                                    <li>e + Option (Alt) + [ = ẹ̀</li>
                                    <li>e + Option (Alt) + ] = ẹ́</li>
                                    <li>s + Option (Alt) = ṣ</li>
                                </ul>
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
            <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                className="min-h-[200px] text-lg"
                placeholder="Start typing in Yoruba..."
            />
            {showVariants && (
                <div style={{ position: 'absolute', top: showVariants.position.y, left: showVariants.position.x }} className="bg-white border rounded shadow-lg flex" onMouseDown={(e) => e.stopPropagation()} >
                    {yorubaCharMap[showVariants.char].map((variant, index) => (
                        <div key={variant} onClick={(e) => {
                            e.stopPropagation()
                            handleVariantClick(variant)
                        }} className="p-2 cursor-pointer hover:bg-gray-200">
                            {index + 1}. {variant}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex justify-end">
                <Button
                    onClick={copyText}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                </Button>
            </div>
            {showInstructions && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Quick Typing Guide:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>[ for low tone (è, ò)</li>
                        <li>] for high tone (é, ó)</li>
                        <li>Option (Alt) for bottom sign (ẹ, ọ, ṣ)</li>
                        <li>Option (Alt) + [ or ] for bottom sign with tone (ẹ̀, ọ́)</li>
                        <li>Shift or Caps Lock for uppercase</li>
                    </ul>
                </div>
            )}
        </div>
    )
}