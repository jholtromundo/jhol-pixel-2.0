import React from 'react';
import { Style } from '../types';

interface Props {
  styles: Style[];
  selectedStyle: Style | null;
  onSelectStyle: (style: Style) => void;
  onRegenerate: (isRegenerating: boolean) => void;
  onConfirm: () => void;
  onBack: () => void;
  showToast: (message: string) => void;
}

const StyleCard: React.FC<{ style: Style; isSelected: boolean; onSelect: () => void; onCopy: () => void; }> = ({ style, isSelected, onSelect, onCopy }) => {
  return (
    <div 
      onClick={onSelect}
      className={`p-4 rounded-lg transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-purple-600/30 border-2 border-purple-500'
          : 'glass-effect hover:border-purple-500'
      }`}
    >
      <div>
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-white mb-1">{style.name}</h3>
            <button 
                onClick={(e) => { e.stopPropagation(); onCopy(); }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copiar prompt de estilo"
            >
                <i className="fas fa-copy"></i>
            </button>
        </div>
        <p className="text-xs text-gray-300 italic break-words">"{style.prompt}"</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {style.tags.map(tag => (
          <span key={tag} className="text-xs bg-white/10 text-gray-200 px-2 py-1 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  )
}

export const Step3_StyleSelection: React.FC<Props> = ({ styles, selectedStyle, onSelectStyle, onRegenerate, onConfirm, onBack, showToast }) => {
  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    showToast('Prompt de estilo copiado!');
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-100">Passo 3: Seleção de Estilo Visual</h2>
      <p className="text-gray-300">A IA gerou 5 propostas de estilo baseadas no seu roteiro. Escolha uma para continuar.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles.map((style, index) => (
          <StyleCard 
            key={index} 
            style={style} 
            isSelected={selectedStyle?.name === style.name}
            onSelect={() => onSelectStyle(style)}
            onCopy={() => handleCopy(style.prompt)}
          />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button onClick={onBack} className="w-full sm:w-auto bg-white/5 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/10 transition">
          <i className="fas fa-arrow-left mr-2"></i> Voltar
        </button>
        <button onClick={() => onRegenerate(true)} className="w-full sm:w-auto bg-white/5 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/10 transition">
          <i className="fas fa-sync-alt mr-2"></i> Gerar Novos Estilos
        </button>
        <button 
          onClick={onConfirm}
          disabled={!selectedStyle}
          className="w-full sm:w-auto flex-grow bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmar Estilo e Gerar <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  );
};