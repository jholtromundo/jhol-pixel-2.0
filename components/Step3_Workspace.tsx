import React, { useState, useEffect } from 'react';
import { AppState, Prompt } from '../types';
import { CHANNELS } from '../constants';

// Internal Components

const Timeline: React.FC<{ scenes: string[], activeScene: string | null, onSelectScene: (scene: string) => void, history: Record<string, Prompt[]> }> = ({ scenes, activeScene, onSelectScene, history }) => {
    return (
        <div className="w-full overflow-x-auto custom-scrollbar pb-3">
            <div className="flex space-x-2">
                {scenes.map((scene, index) => {
                    const hasPrompts = history[scene] && history[scene].length > 0;
                    return (
                        <button
                            key={index}
                            onClick={() => onSelectScene(scene)}
                            className={`flex-shrink-0 p-2 rounded-md transition-all duration-200 w-28 text-left text-xs ${activeScene === scene ? 'bg-purple-600/50 border border-purple-400' : 'bg-white/5 hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Cena {index + 1}</span>
                                {hasPrompts && <i className="fas fa-check-circle text-green-400"></i>}
                            </div>
                            <p className="text-gray-300 line-clamp-2 mt-1">{scene}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

const FocusModeModal: React.FC<{ prompt: Prompt, onClose: () => void, onSave: (newText: string) => void }> = ({ prompt, onClose, onSave }) => {
    const [text, setText] = useState(prompt.text);
    return (
        <div className="focus-mode-overlay flex items-center justify-center p-4" onClick={onClose}>
            <div className="focus-mode-modal w-full max-w-3xl glass-effect rounded-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                 <h3 className="p-4 font-bold text-xl neon-text-purple border-b border-white/10">Modo Foco</h3>
                 <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-64 bg-transparent p-4 text-lg text-gray-200 resize-none focus:outline-none custom-scrollbar"
                 />
                 <div className="p-4 flex justify-end gap-2 border-t border-white/10">
                     <button onClick={onClose} className="btn-secondary-neon !py-2">Cancelar</button>
                     <button onClick={() => onSave(text)} className="btn-primary-neon !py-2">Salvar Alterações</button>
                 </div>
            </div>
        </div>
    );
};


interface Props {
  state: AppState;
  onGeneratePrompts: (scene: string) => void;
  onGenerateAllPrompts: () => void;
  onGenerateVariations: (scene: string, prompt: Prompt) => void;
  onGenerateSceneVariation: (scene: string, prompt: Prompt) => void;
  onGenerateMotion: (scene: string, promptId: string) => void;
  onGenerateMotionVariation: (scene: string, promptId: string, originalMotion: string) => void;
  onGenerateAssets: (scene: string, originalPrompt: Prompt) => void;
  onRefinePrompt: (scene: string, originalPrompt: Prompt, modification: string) => void;
  onToggleFavorite: (promptText: string) => void;
  onSetStyleGuidePrompt: (promptText: string | null) => void;
  onBack: () => void;
  showToast: (message: string) => void;
  onExtractPalette: (scene: string, promptId: string) => void;
  onToggleKeyScene: (prompt: Prompt) => void;
  getRefinementSuggestions: (promptText: string) => Promise<string[]>;
}

export const Step3_Workspace: React.FC<Props> = ({ state, onGenerateAllPrompts, onBack, onSetStyleGuidePrompt, onExtractPalette, onToggleKeyScene, getRefinementSuggestions, ...rest }) => {
  const activeProject = state.projects[state.activeProjectId!];
  const [activeScene, setActiveScene] = useState<string | null>(activeProject.segmentedScenes[0] || null);

  const channelInfo = CHANNELS.find(c => c.id === activeProject.channel);
  const styleInfo = activeProject.selectedStyles.length > 1 ? "Estilos Mesclados" : activeProject.selectedStyles[0]?.name;
  
  const handleSelectScene = (scene: string) => {
    setActiveScene(scene);
  };
  
  const activeScenePrompts = activeScene ? activeProject.promptHistory[activeScene] || [] : [];
  
  return (
    <div className="flex flex-col space-y-4 animate-fade-in h-[80vh]">
      <div className="glass-effect p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-100 neon-text-cyan">Workspace de Geração</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300 mt-1">
            <span><strong>Canal:</strong> {channelInfo?.name}</span>
            <span><strong>Estilo Base:</strong> {styleInfo}</span>
          </div>
        </div>
        <div className="flex gap-2 self-start md:self-center">
             <button onClick={onBack} className="btn-secondary-neon"><i className="fas fa-arrow-left mr-2"></i>Alterar</button>
             <button onClick={onGenerateAllPrompts} className="btn-primary-neon"><i className="fas fa-fast-forward mr-2"></i>Gerar Tudo</button>
        </div>
      </div>
      
      <Timeline scenes={activeProject.segmentedScenes} activeScene={activeScene} onSelectScene={handleSelectScene} history={activeProject.promptHistory} />
        
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
        {activeScene ? (
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">Cena: <span className="text-purple-300">{activeScene}</span></h3>
                 {activeProject.suggestedAssets.length > 0 && (
                    <div className="bg-blue-900/30 border border-blue-500 text-blue-200 p-3 rounded-md text-sm">
                        <p><strong>Sugestão da IA:</strong> Percebi que <span className="font-bold">{activeProject.suggestedAssets.join(', ')}</span> são elementos recorrentes. Considere usar a função <i className="fas fa-cut"></i> <strong>Asset</strong> para garantir a consistência.</p>
                    </div>
                )}
                {activeScenePrompts.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Placeholder for PromptCards */}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <button onClick={() => rest.onGeneratePrompts(activeScene)} className="btn-primary-neon">
                            <i className="fas fa-magic mr-2"></i> Gerar Prompts para esta Cena
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Selecione uma cena na timeline para começar.</div>
        )}
      </div>

    </div>
  );
};
