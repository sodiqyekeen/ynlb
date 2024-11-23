import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'

export function PWAPrompt() {
    const [showPrompt, setShowPrompt] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowPrompt(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt')
                } else {
                    console.log('User dismissed the install prompt')
                }
                setShowPrompt(false)
                setDeferredPrompt(null)
            })
        }
    }

    if (!showPrompt) return null

    return (
        <div className="fixed top-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg flex items-center justify-between z-50 max-w-xl mx-auto md:w-full">
            <p className="text-gray-800 mr-4">Install YNLB for a better experience!</p>
            <div className="flex space-x-2">
                <Button onClick={() => setShowPrompt(false)} variant="outline">
                    Not now
                </Button>
                <Button onClick={handleInstall} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    Install
                </Button>
            </div>
        </div>
    )
}