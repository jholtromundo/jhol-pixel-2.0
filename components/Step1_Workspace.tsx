import React, { useState, useRef } from 'react';
import { AppState, ChannelId, Language, SegmentationConfig } from '../types';
import { CHANNELS, LANGUAGES, GALLERY_STYLES } from '../constants';
import { AIAssistant } from './AIAssistant';

interface Props {
  state: AppState;
  setScript: (value: string) => void;
  setChannel: (value: ChannelId) => void;
  setLanguage: (value: Language) => void;
  setSegmentationConfig: (config: SegmentationConfig) => void;
  setSelectedGalleryStyleId: (id: string) => void;
  onAnalyze: () => void;
  onNext: () => void;
  onUpdateScenes: (scenes: string[]) => void;
  onSendMessageToAssistant: (message: string) => void;
}

export const Step1_Workspace: React.FC<Props> = ({ state, setScript, setChannel, setLanguage, setSegmentationConfig, setSelectedGalleryStyleId, onAnalyze, onNext, onUpdateScenes, onSendMessageToAssistant }) => {
  const activeProject = state.projects[state.activeProjectId!];
  const { script, channel, language, segmentationConfig, segmentedScenes, chatHistory, selectedGalleryStyleId, pacingAnalysis } = activeProject;
  const { isChatting } = state;
  const [activeTab, setActiveTab] = useState<'script' | 'assistant'>('script');
  
  const isAnalyzeDisabled = !script || !channel || (channel === 'stylegallery' && !selectedGalleryStyleId);
  const isNextDisabled = segmentedScenes.length === 0;

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragItem.current = index;
    setDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
        const newScenes = [...segmentedScenes];
        const draggedItemContent = newScenes.splice(dragItem.current, 1)[0];
        newScenes.splice(dragOverItem.current, 0, draggedItemContent);
        onUpdateScenes(newScenes);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDragging(false);
  };
  
  const handleDeleteScene = (indexToDelete: number) => {
      const newScenes = segmentedScenes.filter((_, index) => index !== indexToDelete);
      onUpdateScenes(newScenes);
  };

  return (
    <div className="animate-fade-in">
        <div className="flex border-b border-white/10 mb-6">
            <button onClick={() => setActiveTab('script')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'script' ? 'border-b-2 border-purple-500 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>
                <i className="fas fa-file-alt mr-2"></i>Roteiro
            </button>
            <button onClick={() => setActiveTab('assistant')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'assistant' ? 'border-b-2 border-purple-500 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>
               <i className="fas fa-magic mr-2"></i>Assistente IA
            </button>
        </div>

      {activeTab === 'script' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Coluna Esquerda: Controles */}
          <div className="flex flex-col space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-100 neon-text-cyan">Passo 1: Contexto e Segmentação</h2>
                <p className="text-gray-300">Forneça o roteiro, defina as opções e analise para criar a fila de cenas.</p>
            </div>
    
            <div className="glass-effect p-4 rounded-lg space-y-4">
                 <label htmlFor="script-input" className="block text-gray-200 font-medium">1. Cole seu roteiro:</label>
                <textarea id="script-input" value={script} onChange={(e) => setScript(e.target.value)} placeholder="Era uma vez..." className="w-full text-white p-3 rounded-lg transition duration-200 h-48 custom-scrollbar input-neon" />
            </div>
    
            <div className="glass-effect p-4 rounded-lg space-y-4">
              <p className="block text-gray-200 font-medium">2. Selecione a estética visual:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHANNELS.map(ch => ( <button key={ch.id} onClick={() => setChannel(ch.id)} className={`p-4 rounded-lg text-left transition-all duration-300 h-full glass-effect ${channel === ch.id ? 'neon-border-selected' : '' }`}> <p className="font-bold text-lg text-white">{ch.name}</p><p className="text-sm text-gray-300">{ch.description}</p></button>))}
              </div>
            </div>

            {channel === 'stylegallery' && (
              <div className="glass-effect p-4 rounded-lg space-y-4 animate-fade-in-up">
                <p className="block text-gray-200 font-medium">2.1. Escolha um estilo na galeria:</p>
                  <div className="flex overflow-x-auto space-x-4 pb-2 custom-scrollbar">
                      {GALLERY_STYLES.map(style => (<button key={style.id} onClick={() => setSelectedGalleryStyleId(style.id)} className={`p-4 rounded-lg text-left transition-all duration-300 h-full glass-effect flex-shrink-0 w-48 flex flex-col justify-between ${selectedGalleryStyleId === style.id ? 'neon-border-selected' : '' }`}><div><p className="font-bold text-white">{style.name}</p><p className="text-xs text-gray-300 mt-1">{style.description}</p></div></button>))}
                  </div>
              </div>
            )}
            
            <div className="glass-effect p-4 rounded-lg space-y-4">
                <p className="block text-gray-200 font-medium">3. Configure a segmentação:</p>
                <div className="flex items-center justify-between">
                    <select value={language} onChange={e => setLanguage(e.target.value as Language)} className="p-2 rounded-md border text-white input-neon bg-bg-mid">
                        {LANGUAGES.map(lang => <option key={lang.id} value={lang.id} className="bg-bg-mid">{lang.name}</option>)}
                    </select>
                    <div className="flex items-center">
                        <input type="checkbox" id="auto-segment" checked={segmentationConfig.isAutomatic} onChange={e => setSegmentationConfig({...segmentationConfig, isAutomatic: e.target.checked})} className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600" />
                        <label htmlFor="auto-segment" className="ml-2 text-sm text-gray-200">Automático</label>
                    </div>
                </div>
                 {!segmentationConfig.isAutomatic && (
                    <div>
                        <label htmlFor="scene-count" className="text-sm text-gray-300">Número de Cenas: {segmentationConfig.sceneCount}</label>
                        <input id="scene-count" type="range" min="10" max="40" value={segmentationConfig.sceneCount} onChange={e => setSegmentationConfig({...segmentationConfig, sceneCount: parseInt(e.target.value)})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                 )}
            </div>
            
            <button onClick={onAnalyze} disabled={isAnalyzeDisabled} className="w-full btn-primary-neon flex items-center justify-center">Analisar Roteiro <i className="fas fa-cogs ml-2"></i></button>
          </div>
    
          <div className="flex flex-col space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-100 neon-text-cyan">Fila de Cenas</h2>
                <p className="text-gray-300">As cenas do seu roteiro aparecerão aqui após a análise.</p>
            </div>
            {pacingAnalysis && (
                <div className="bg-purple-900/20 border border-purple-500 text-purple-200 p-3 rounded-md text-sm animate-fade-in">
                    <p><strong><i className="fas fa-tachometer-alt mr-2"></i>Análise de Ritmo da IA:</strong> {pacingAnalysis}</p>
                </div>
            )}
            <div className="glass-effect rounded-lg p-4 h-full flex flex-col">
                {segmentedScenes.length > 0 ? (
                     <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                        <ol className="space-y-3 text-gray-200">
                        {segmentedScenes.map((scene, index) => (
                            <li key={index} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()} className={`flex items-start gap-3 p-2 rounded-md group hover:bg-white/5 transition-all duration-200 ${dragItem.current === index && dragging ? 'bg-purple-500/50' : 'cursor-grab'}`}>
                                <i className="fas fa-grip-vertical text-gray-500 mt-1.5 flex-shrink-0"></i>
                                <span className="bg-purple-600/50 text-purple-200 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">{String(index + 1).padStart(2, '0')}</span>
                                <p className="flex-grow">{scene}</p>
                                <button onClick={() => handleDeleteScene(index)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" title="Excluir cena"><i className="fas fa-trash-alt"></i></button>
                            </li>
                        ))}
                        </ol>
                    </div>
                ) : ( <div className="flex-grow flex items-center justify-center text-center text-gray-400"><p>Aguardando análise do roteiro...</p></div>)}
               
                <button onClick={onNext} disabled={isNextDisabled} className="w-full mt-4 btn-primary-neon flex items-center justify-center">
                    {channel === 'stylegallery' || channel === 'bw' ? 'Ir para Geração' : 'Continuar para Estilos'} <i className="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assistant' && (
          <AIAssistant history={chatHistory} isChatting={isChatting} onSendMessage={onSendMessageToAssistant} />
      )}
    </div>
  );
};
