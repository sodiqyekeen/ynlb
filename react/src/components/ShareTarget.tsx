import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function ShareTarget() {
    const [sharedText, setSharedText] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const text = params.get('text')
        if (text) {
            setSharedText(text)
            navigate('/', { state: { sharedText: text } })
        }
    }, [navigate])

    if (!sharedText) {
        return null
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">Shared Text</h2>
                <p className="text-gray-600">{sharedText}</p>
            </div>
        </div>
    )
}