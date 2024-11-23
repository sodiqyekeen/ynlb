import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdatePrompt() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW()

    const [showPrompt, setShowPrompt] = useState(false)

    useEffect(() => {
        if (needRefresh) {
            setShowPrompt(true)
        }
    }, [needRefresh])

    const handleUpdate = () => {
        updateServiceWorker(true)
        setShowPrompt(false)
    }

    if (!showPrompt) return null

    return (
        <div className="fixed top-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg flex items-center justify-between">
            <p className="text-gray-800 mr-4">A new version of YNLB is available!</p>
            <div className="flex space-x-2">
                <Button onClick={() => setShowPrompt(false)} variant="outline">
                    Later
                </Button>
                <Button onClick={handleUpdate} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    Update now
                </Button>
            </div>
        </div>
    )
}