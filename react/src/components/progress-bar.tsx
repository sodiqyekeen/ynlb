import React from 'react';

interface ProgressBarProps {
    progress: number;
    text: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, text }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
            <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                {text}
            </span>
        </div>
    );
};