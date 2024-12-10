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
import { X, Copy, Keyboard } from 'lucide-react'


const yorubaCharMap: { [key: string]: string[] } = {
    a: ['a', 'à', 'á'],
    e: ['e', 'è', 'é', 'ẹ', 'ẹ̀', 'ẹ́'],
    i: ['i', 'ì', 'í'],
    o: ['o', 'ò', 'ó', 'ọ', 'ọ̀', 'ọ́'],
    u: ['u', 'ù', 'ú'],
    n: ['n', 'ǹ', 'ń'],
    s: ['s', 'ṣ'],
    A: ['A', 'À', 'Á'],
    E: ['E', 'È', 'É', 'Ẹ', 'Ẹ̀', 'Ẹ́'],
    I: ['I', 'Ì', 'Í'],
    O: ['O', 'Ò', 'Ó', 'Ọ', 'Ọ̀', 'Ọ́'],
    U: ['U', 'Ù', 'Ú'],
    N: ['N', 'Ǹ', 'Ń'],
    S: ['S', 'Ṣ']
};

const unsupportedChars = ['c', 'q', 'v', 'x', 'z'];

export default function YorubaTextEditor() {
    const [text, setText] = useState<string>('');
    const [showVariants, setShowVariants] = useState<{ char: string, position: { x: number, y: number } } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);

    const mapKeyCodeToChar = (code: string, isUpperCase: boolean): string => {
        switch (code) {
            case 'KeyA':
                return isUpperCase ? 'A' : 'a';
            case 'KeyE':
                return isUpperCase ? 'E' : 'e';
            case 'KeyI':
                return isUpperCase ? 'I' : 'i';
            case 'KeyO':
                return isUpperCase ? 'O' : 'o';
            case 'KeyU':
                return isUpperCase ? 'U' : 'u';
            case 'KeyN':
                return isUpperCase ? 'N' : 'n';
            case 'KeyS':
                return isUpperCase ? 'S' : 's';
            default:
                return '';
        }
    }

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const key = e.key.toLowerCase();
        if (unsupportedChars.includes(key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            alert(`The character '${key}' is not supported in Yorùbá alphabets.`);
            return;
        }

        if ((e.ctrlKey || e.metaKey) && !e.altKey) {
            return;
        }

        const isUpperCase = e.getModifierState('CapsLock') || e.shiftKey;
        const char = e.altKey ? mapKeyCodeToChar(e.code, isUpperCase) : isUpperCase ? key.toUpperCase() : key;
        if (yorubaCharMap[char]) {
            e.preventDefault();
            const isHotKey = e.altKey && (e.ctrlKey || e.metaKey);
            if (!holdTimeout || isHotKey) {
                const delay = isHotKey ? 0 : 200;
                const timeout = setTimeout(() => {
                    if (textareaRef.current && document.activeElement === textareaRef.current) {
                        const rect = textareaRef.current.getBoundingClientRect();
                        const start = textareaRef.current.selectionStart!;
                        const x = rect.left + (start * 8);
                        const y = rect.top + 20;
                        setShowVariants({
                            char,
                            position: { x, y }
                        });
                    }
                }, delay);
                setHoldTimeout(timeout);
            }
        } else if (showVariants) {
            setShowVariants(null);
        }
        if (showVariants && !isNaN(Number(key))) {
            const index = Number(key) - 1;
            if (index >= 0 && index < yorubaCharMap[showVariants.char].length) {
                e.preventDefault();
                insertAtCursor(yorubaCharMap[showVariants.char][index]);
            }
        }
    }, [holdTimeout, showVariants]);

    const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const key = e.key.toLowerCase();
        if (unsupportedChars.includes(key)) {
            return;
        }
        if (e.ctrlKey || e.metaKey) {
            return;
        }
        const isUpperCase = e.getModifierState('CapsLock') || e.shiftKey;
        const char = isUpperCase ? key.toUpperCase() : key;
        if (yorubaCharMap[char]) {
            if (holdTimeout) {
                clearTimeout(holdTimeout);
                setHoldTimeout(null);
                if (!showVariants) {
                    setText(prevText => prevText + char);
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
            textareaRef.current.focus();
            setTimeout(() => {
                textareaRef.current!.setSelectionRange(start + variant.length, start + variant.length);
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
            })
            .catch(err => {
                console.error('Failed to copy text: ', err)
            })
    }

    const clearText = () => {
        setText('');
    };

    useEffect(() => {
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
                <h2 className="text-2xl font-bold text-gray-800">Yorùbá Text Editor</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Keyboard className="w-4 h-4 mr-2" />
                            Typing Instructions
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Yorùbá Typing Instructions</DialogTitle>
                            <DialogDescription>
                                How to type Yorùbá characters with diacritics:
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[250px] w-full pr-4">
                            <ul className="list-disc pl-5 space-y-2 mt-3">
                                <li>Press and hold a, e, i, n, o, s or u to see character variants</li>
                                <li>Press Ctrl/Command + Alt/Option + a, e, i, n, o, s or u to see character variants</li>
                                <li>Click on the desired variant to insert it</li>
                                <li>Press the corresponding number key to insert the variant</li>
                                <li>Use Shift or Caps Lock for uppercase letters</li>
                                <li>The characters c, q, v, x, and z are not supported in Yorùbá alphabets</li>
                            </ul>
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
                className="min-h-[300px] text-lg"
                placeholder="Start typing in Yorùbá..."
            />
            {showVariants && (
                <div style={{ position: 'absolute', top: showVariants.position.y, left: showVariants.position.x }} className="bg-white border rounded shadow-lg flex" onMouseDown={(e) => e.stopPropagation()} >
                    {yorubaCharMap[showVariants.char].map((variant, index) => (
                        <div key={variant} onClick={(e) => {
                            e.stopPropagation()
                            handleVariantClick(variant)
                        }} className="p-2 cursor-pointer hover:bg-gray-200 flex flex-col items-center">
                            <span className='font-semibold'>{variant}</span>
                            <span className="text-xs text-gray-400 mt-1">{index + 1}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end space-x-2">
                {text && (
                    <Button
                        onClick={clearText}
                        variant="outline"
                        className="bg-white hover:bg-gray-100"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                )}
                {text && (
                    <Button
                        onClick={copyText}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                    </Button>
                )}
            </div>

        </div>
    )
}