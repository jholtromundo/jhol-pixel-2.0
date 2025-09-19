import React from 'react';
import { GalleryStyle } from '../types';
import { SHOWCASE_PROMPTS } from '../constants';

interface Props {
  onStart: () => void;
  onSelectShowcaseStyle: (style: GalleryStyle) => void;
}

export const InitialScreen: React.FC<Props> = ({ onStart, onSelectShowcaseStyle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="text-center space-y-8 glass-effect p-8 md:p-12 rounded-2xl max-w-4xl mx-auto w-full">
        <div className="flex justify-center items-center gap-4">
          <i className="fas fa-robot text-5xl md:text-7xl text-purple-400 neon-text-purple"></i>
        </div>
        <h1 className="text-4xl md:text-6xl font-black neon-text-purple tracking-wider">
          Jhol Pixel 2.0
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto">
          Sua central de comando para transformar roteiros em universos visuais com o poder da IA.
        </p>
        
        <div className="pt-4 border-t border-white/10">
          <button onClick={onStart} className="btn-primary-neon text-lg">
            Começar um Projeto do Zero <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>

        <div className="pt-6">
            <h2 className="text-xl font-bold neon-text-cyan mb-4">Ou inspire-se em Obras-Primas:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SHOWCASE_PROMPTS.map(prompt => (
                    <div key={prompt.id} className="glass-effect p-4 rounded-lg flex flex-col text-left h-full">
                        <h3 className="font-bold text-lg text-white">{prompt.name}</h3>
                        <p className="text-sm text-gray-300 flex-grow mt-1">{prompt.description}</p>
                        <button onClick={() => onSelectShowcaseStyle(prompt)} className="w-full mt-4 btn-secondary-neon !py-2 text-sm">
                            Usar este Estilo
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
