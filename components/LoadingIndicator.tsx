import React, { useState, useEffect } from 'react';
import { MOTIVATIONAL_TIPS } from '../constants';

interface Props {
  isLoading: boolean;
  message: string;
}

export const LoadingIndicator: React.FC<Props> = ({ isLoading, message }) => {
    const [tip, setTip] = useState('');

    useEffect(() => {
        if (isLoading) {
            const showRandomTip = () => {
                const randomTip = MOTIVATIONAL_TIPS[Math.floor(Math.random() * MOTIVATIONAL_TIPS.length)];
                setTip(randomTip);
            };

            showRandomTip();
            const intervalId = setInterval(showRandomTip, 4000);

            return () => clearInterval(intervalId);
        }
    }, [isLoading]);

    if (!isLoading) {
        return null;
    }

    return (
        <div 
            className="fixed top-0 left-0 w-full h-auto bg-black/70 backdrop-blur-sm z-50 p-3 shadow-lg shadow-purple-500/20 border-b border-purple-500/30 loading-conduit overflow-hidden"
            role="status"
            aria-live="assertive"
        >
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-center relative z-10">
                <div className="flex items-center">
                    <div className="w-5 h-5 border-4 border-t-transparent border-purple-300 rounded-full animate-spin mr-3"></div>
                    <p className="font-semibold text-gray-100 text-shadow">{message}</p>
                </div>
                {tip && (
                    <div key={tip} className="hidden md:block text-sm text-cyan-200 italic animate-fade-in-out-tip">
                        "{tip}"
                    </div>
                )}
            </div>
        </div>
    );
};