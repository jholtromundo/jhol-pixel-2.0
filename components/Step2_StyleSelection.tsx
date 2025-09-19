import React, { useState, useMemo } from 'react';
import { AppState, Style } from '../types';

const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

const MoodboardPreview: React.FC<{ prompt: string }> = ({ prompt }) => {
    const colors = useMemo(() => {
        const baseHash = hashCode(prompt);
        const generatedColors = [];
        for (let i = 0; i < 4; i++) {
            const h = (baseHash + i * 100) % 360;
            const s = 50 + (baseHash >> i) % 50;
            const l1 = 40 + (baseHash >> (i*2)) % 20;
            const l2 = l1 + 20;
            generatedColors.push(`linear-gradient(135deg, hsl(${h}, ${s}%, ${l1}%), hsl(${(h + 40) % 360}, ${s}%, ${l2}%))`);
        }
        return generatedColors;
    }, [prompt]);

    return (
        <div className="grid grid-cols-2 gap-1 w-full aspect-video rounded-md overflow-hidden mb-3">
            {colors.map((bg, i) => <div key={i} style={{ background: bg }}></div>)}
        </div>
    );
};


const StyleCard: React.FC<{ 
    style: Style; 
    isSelected: boolean; 
    isFavorite: boolean;
    onSelect: (e: React.MouseEvent) => void; 
    onCopy: () => void;
    onGenerateVariations: () => void;
    onToggleFavorite: () => void;
}> = ({ style, isSelected, isFavorite, onSelect, onCopy, onGenerateVariations, onToggleFavorite }) => {
  return (
    <div 
      onClick={onSelect}
      className={`p-4 rounded-lg transition-all duration-300 cursor-pointer flex flex-col justify-between relative group animate-fade-in-up glass-effect ${
        isSelected ? 'neon-border-selected' : ''
      }`}
    >
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
           <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className="text-gray-400 hover:text-yellow-400 transition-colors w-8 h-8 bg-black/30 rounded-full"
                title={isFavorite ? "Remover dos Favoritos" : "Salvar nos Favoritos"}
            >
                <i className={`fas fa-star ${isFavorite ? 'text-yellow-400' : ''}`}></i>
            </button>
      </div>
      <MoodboardPreview prompt={style.prompt} />
      <div>
        <h3 className="font-bold text-lg text-white mb-1 pr-8">{style.name}</h3>
        <p className="text-xs text-gray-300 italic break-words line-clamp-2 group-hover:line-clamp-none">"{style.prompt}"</p>
      </div>
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex flex-wrap gap-2">
          {style.tags.map(tag => (
            <span key={tag} className="text-xs bg-white/10 text-gray-200 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm border-t border-white/10 pt-2">
            <button onClick={(e) => {e.stopPropagation(); onCopy()}} className="hover:text-white transition-colors" title="Copiar Prompt"><i className="fas fa-copy mr-1"></i> Copiar</button>
            <button onClick={(e) => {e.stopPropagation(); onGenerateVariations()}} className="hover:text-white transition-colors" title="Gerar Variações"><i className="fas fa-magic mr-1"></i> Variações</button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  state: AppState;
  onSelectStyle: (style: Style, isMultiSelect: boolean) => void;
  onRegenerate: (isRegenerating: boolean) => void;
  onGenerateVariations: (style: Style) => void;
  onToggleFavorite: (style: Style) => void;
  onConfirm: (mixPercentages?: { [id: string]: number }) => void;
  onConfirmCustomStyle: (promptText: string) => void;
  onBack: () => void;
  showToast: (message: string) => void;
}

export const Step2_StyleSelection: React.FC<Props> = ({ state, onSelectStyle, onRegenerate, onGenerateVariations, onToggleFavorite, onConfirm, onConfirmCustomStyle, onBack, showToast }) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'favorites'>('proposals');
  const [customStyleInput, setCustomStyleInput] = useState('');
  const activeProject = state.projects[state.activeProjectId!];
  const [mixValue, setMixValue] = useState(50);

  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    showToast('Prompt de estilo copiado!');
  };

  const handleConfirm = () => {
    if (activeProject.selectedStyles.length === 2) {
      onConfirm({
        [activeProject.selectedStyles[0].id]: mixValue,
        [activeProject.selectedStyles[1].id]: 100 - mixValue,
      });
    } else {
      onConfirm();
    }
  };

  const currentList = activeTab === 'proposals' ? activeProject.styleProposals : activeProject.favoriteStyles;

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-6 animate-fade-in">
        <div>
            <h2 className="text-2xl font-bold text-gray-100 neon-text-cyan">Passo 2: Definição de Estilo Visual</h2>
            <p className="text-gray-300">Escolha uma proposta, mescle duas (<kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl/Cmd</kbd> + clique), ou cole seu próprio estilo.</p>
        </div>

        {activeProject.selectedStyles.length === 2 && (
            <div className="glass-effect p-4 rounded-lg space-y-3 my-4 animate-fade-in-up">
                <h3 className="font-bold text-gray-200"><i className="fas fa-blender mr-2 text-purple-400"></i>Mixer de Estilos Avançado</h3>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold truncate flex-1 text-right">{activeProject.selectedStyles[0].name}</span>
                    <input type="range" min="0" max="100" value={mixValue} onChange={e => setMixValue(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer flex-2" />
                    <span className="text-sm font-semibold truncate flex-1">{activeProject.selectedStyles[1].name}</span>
                </div>
                <div className="text-center font-bold text-purple-300">{mixValue}% / {100 - mixValue}%</div>
            </div>
        )}
      
      <div className="flex border-b border-white/10">
          <button onClick={() => setActiveTab('proposals')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'proposals' ? 'border-b-2 border-purple-500 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>Propostas</button>
          <button onClick={() => setActiveTab('favorites')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'favorites' ? 'border-b-2 border-purple-500 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>Favoritos ({activeProject.favoriteStyles.length})</button>
      </div>

      <div>
        {currentList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentList.map((style) => (
                <StyleCard 
                    key={style.id} 
                    style={style} 
                    isSelected={activeProject.selectedStyles.some(s => s.id === style.id)}
                    isFavorite={activeProject.favoriteStyles.some(s => s.id === style.id)}
                    onSelect={(e) => onSelectStyle(style, e.ctrlKey || e.metaKey)}
                    onCopy={() => handleCopy(style.prompt)}
                    onGenerateVariations={() => onGenerateVariations(style)}
                    onToggleFavorite={() => onToggleFavorite(style)}
                />
                ))}
            </div>
        ) : (
            <div className="text-center py-12 glass-effect rounded-lg">
                <p className="text-gray-400">{activeTab === 'proposals' ? 'Nenhuma proposta gerada ainda.' : 'Você ainda não favoritou nenhum estilo.'}</p>
            </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button onClick={onBack} className="w-full sm:w-auto btn-secondary-neon"><i className="fas fa-arrow-left mr-2"></i> Voltar</button>
        {activeTab === 'proposals' && (<button onClick={() => onRegenerate(true)} className="w-full sm:w-auto btn-secondary-neon"><i className="fas fa-sync-alt mr-2"></i> Gerar Novas Propostas</button>)}
        <button onClick={handleConfirm} disabled={activeProject.selectedStyles.length === 0} className="w-full sm:w-auto flex-grow btn-primary-neon">
          {activeProject.selectedStyles.length > 1 ? 'Mesclar Estilos e Continuar' : 'Confirmar Estilo e Gerar'} <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  );
};
