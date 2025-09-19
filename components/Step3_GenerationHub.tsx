import React, { useState } from 'react';
import { AppState, Prompt } from '../types';
import { CHANNELS } from '../constants';

interface PromptCardProps {
    prompt: Prompt;
    isFavorite: boolean;
    onCopy: () => void;
    onToggleFavorite: () => void;
    onGenerateVariations: () => void;
    onGenerateSceneVariation: () => void;
    onGenerateMotion: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, isFavorite, onCopy, onToggleFavorite, onGenerateVariations, onGenerateSceneVariation, onGenerateMotion }) => {
    return (
        <div className="glass-effect p-4 rounded-lg flex flex-col space-y-3 animate-fade-in-up">
            <p className="text-gray-200 flex-grow">{prompt.text}</p>
            {prompt.motionPrompt && (
                <div className="bg-black/20 p-2 rounded-md border border-white/10 flex items-center justify-between">
                    <p className="text-sm text-purple-300 break-all"><i className="fas fa-video mr-2"></i>{prompt.motionPrompt}</p>
                    <button onClick={() => navigator.clipboard.writeText(prompt.motionPrompt || '')} title="Copiar Prompt de Movimento" className="ml-2 text-gray-400 hover:text-white">
                        <i className="fas fa-copy"></i>
                    </button>
                </div>
            )}
            <div className="flex items-center space-x-3 text-gray-300 text-sm border-t border-white/10 pt-3 mt-2">
                <button onClick={onCopy} title="Copiar" className="hover:text-white transition-colors"><i className="fas fa-copy mr-1"></i>Copiar</button>
                <button onClick={onToggleFavorite} title={isFavorite ? "Remover Favorito" : "Favoritar"} className={`transition-colors ${isFavorite ? 'text-yellow-400' : 'hover:text-yellow-400'}`}>
                    <i className={`fas fa-star mr-1`}></i>Favorito
                </button>
                <button onClick={onGenerateVariations} title="Gerar Variações do Prompt" className="hover:text-white transition-colors"><i className="fas fa-magic mr-1"></i>Variações</button>
                <button onClick={onGenerateSceneVariation} title="Gerar Variação de Cena" className="hover:text-white transition-colors"><i className="fas fa-dice mr-1"></i>Cena</button>
                <button onClick={onGenerateMotion} title="Gerar Prompt de Movimento" className="hover:text-white transition-colors"><i className="fas fa-camera mr-1"></i>Movimento</button>
            </div>
        </div>
    );
}

interface SceneAccordionItemProps {
  scene: string;
  sceneIndex: number;
  prompts: Prompt[];
  isExpanded: boolean;
  onToggle: () => void;
  state: AppState;
  onGeneratePrompts: (scene: string) => void;
  onGenerateVariations: (scene: string, prompt: Prompt) => void;
  onGenerateSceneVariation: (scene: string, prompt: Prompt) => void;
  onGenerateMotion: (scene: string, promptId: string) => void;
  onToggleFavorite: (promptText: string) => void;
  showToast: (message: string) => void;
}

const SceneAccordionItem: React.FC<SceneAccordionItemProps> = ({ scene, sceneIndex, prompts, isExpanded, onToggle, state, onGeneratePrompts, ...rest }) => {
  // FIX: Get the active project from the app state.
  const activeProject = state.projects[state.activeProjectId!];
  return (
    <div className="glass-effect rounded-lg overflow-hidden transition-all duration-300">
      <button onClick={onToggle} className="w-full text-left p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
        <div className="flex items-center flex-grow">
          <span className={`bg-purple-600/50 text-purple-200 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3 ${prompts?.length > 0 ? 'bg-green-600/50 text-green-200' : ''}`}>
            {prompts?.length > 0 ? <i className="fas fa-check"></i> : String(sceneIndex + 1).padStart(2, '0')}
          </span>
          <p className="text-gray-200 flex-grow">{scene}</p>
        </div>
        <i className={`fas fa-chevron-down transition-transform duration-300 ml-4 ${isExpanded ? 'rotate-180' : ''}`}></i>
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-white/10 animate-fade-in-up">
          {prompts && prompts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {prompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  // FIX: Access 'favorites' from the active project, not the global state.
                  isFavorite={activeProject.favorites.includes(prompt.text)}
                  onCopy={() => { navigator.clipboard.writeText(prompt.text); rest.showToast('Prompt copiado!'); }}
                  onToggleFavorite={() => rest.onToggleFavorite(prompt.text)}
                  onGenerateVariations={() => rest.onGenerateVariations(scene, prompt)}
                  onGenerateSceneVariation={() => rest.onGenerateSceneVariation(scene, prompt)}
                  onGenerateMotion={() => rest.onGenerateMotion(scene, prompt.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <button onClick={() => onGeneratePrompts(scene)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition">
                <i className="fas fa-magic mr-2"></i> Gerar 3 Prompts de Imagem
              </button>
            </div>
          )}
        </div>
      )}
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
  onToggleFavorite: (promptText: string) => void;
  onBack: () => void;
  showToast: (message: string) => void;
}

export const Step3_Workspace: React.FC<Props> = ({ state, onGenerateAllPrompts, onBack, ...rest }) => {
  // FIX: Get the active project from the app state.
  const activeProject = state.projects[state.activeProjectId!];
  // FIX: Access 'segmentedScenes' from the active project.
  const [expandedScene, setExpandedScene] = useState<string | null>(activeProject.segmentedScenes[0] || null);

  // FIX: Access 'channel' from the active project.
  const channelInfo = CHANNELS.find(c => c.id === activeProject.channel);
  // FIX: Access 'selectedStyles' from the active project.
  const styleInfo = activeProject.selectedStyles.length > 1 ? "Estilos Mesclados" : activeProject.selectedStyles[0]?.name;
  // FIX: Access 'promptHistory' from the active project.
  const completedScenes = Object.keys(activeProject.promptHistory).filter(key => activeProject.promptHistory[key]?.length > 0).length;
  // FIX: Access 'segmentedScenes' from the active project.
  const totalScenes = activeProject.segmentedScenes.length;

  const handleToggle = (scene: string) => {
    setExpandedScene(current => (current === scene ? null : scene));
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <div className="glass-effect p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Passo 3: Workspace de Geração</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300 mt-1">
            <span><strong>Canal:</strong> {channelInfo?.name}</span>
            <span><strong>Estilo:</strong> {styleInfo}</span>
            <span className="font-bold text-purple-300">
                {completedScenes} de {totalScenes} cenas concluídas
            </span>
          </div>
        </div>
        <div className="flex gap-2 self-start md:self-center">
             <button onClick={onBack} className="bg-white/5 text-white font-bold py-2 px-4 rounded-lg hover:bg-white/10 transition">
                <i className="fas fa-arrow-left mr-2"></i> Alterar Estilo
            </button>
             <button onClick={onGenerateAllPrompts} disabled={completedScenes === totalScenes} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <i className="fas fa-fast-forward mr-2"></i> Gerar para Todas
            </button>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
        {/* FIX: Access 'segmentedScenes' from the active project. */}
        {activeProject.segmentedScenes.map((scene, index) => (
          <SceneAccordionItem
            key={index}
            scene={scene}
            sceneIndex={index}
            // FIX: Access 'promptHistory' from the active project.
            prompts={activeProject.promptHistory[scene]}
            isExpanded={expandedScene === scene}
            onToggle={() => handleToggle(scene)}
            state={state}
            {...rest}
          />
        ))}
      </div>
    </div>
  );
};