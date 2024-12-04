
import React from 'react'

interface SliderProps {
    id: string
    min: number
    max: number
    value: number
    onChange: (value: number) => void
    className?: string
}

const Slider: React.FC<SliderProps> = ({ id, min, max, value, onChange, className }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(event.target.value))
    }

    return (
        <input
            type="range"
            id={id}
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className={`slider ${className}`}
        />
    )
}

export { Slider }