
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface Props {
  history: ChatMessage[];
  isChatting: boolean;
  onSendMessage: (message: string) => void;
}

export const AIAssistant: React.FC<Props> = ({ history, isChatting, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [history]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isChatting) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="glass-effect rounded-lg p-4 flex flex-col h-[70vh] animate-fade-in-up">
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-4 space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="whitespace-pre-wrap">{msg.parts.map(p => p.text).join('')}</p>
            </div>
          </div>
        ))}
        {isChatting && (
            <div className="flex justify-start">
                 <div className="max-w-xl p-3 rounded-lg bg-gray-700 text-gray-200">
                    <span className="animate-pulse">...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="mt-4 flex gap-2 border-t border-white/10 pt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          placeholder="Peça ideias, ajuda com o roteiro..."
          className="w-full bg-black/20 text-white p-3 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition duration-200 custom-scrollbar resize-none"
          rows={2}
          disabled={isChatting}
        />
        <button type="submit" disabled={isChatting || !input.trim()} className="bg-purple-600 text-white font-bold p-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed h-full">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};
