import React, { useState } from 'react';
import { Settings, Prompt } from '../types';
import { getAchievement } from '../achievements';


interface Props {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
  history: Record<string, Prompt[]>;
  onFindReplace: (find: string, replace: string) => void;
  achievements: string[];
}

export const SettingsModal: React.FC<Props> = ({ settings, onSave, onClose, history, onFindReplace, achievements }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    onSave(currentSettings);
  };
  
  const handleExport = (format: 'txt' | 'json' | 'storyboard') => {
    if (Object.keys(history).length === 0) {
        alert("Nenhum histórico para exportar.");
        return;
    }
    
    try {
        let content: string;
        let blobType: string;
        let extension: string;

        if (format === 'json') {
            content = JSON.stringify(history, null, 2);
            blobType = 'application/json;charset=utf-8';
            extension = 'json';
        } else if (format === 'txt') {
            content = `Jhol Pixel - Histórico de Prompts\n\n`;
            Object.entries(history).forEach(([scene, prompts]) => {
                content += `========================================\nCENA: ${scene}\n========================================\n\n`;
                (prompts as Prompt[]).forEach((prompt, index) => {
                    content += `PROMPT ${index + 1}:\n${prompt.text}\n\n`;
                    if (prompt.motionPrompt) content += `-> MOVIMENTO: ${prompt.motionPrompt}\n\n`;
                });
            });
            blobType = 'text/plain;charset=utf-8';
            extension = 'txt';
        } else { // storyboard
             const storyboardWindow = window.open('', '_blank');
             if (!storyboardWindow) {
                 alert('Por favor, habilite pop-ups para ver o storyboard.');
                 return;
             }
             let html = `<html><head><title>Storyboard</title><style>body{font-family:sans-serif;background:#111;color:#eee;padding:2rem} .scene{border:1px solid #444;border-radius:8px;margin-bottom:2rem;padding:1rem;} h2{color:#a855f7;} p{background:#222;padding:0.5rem;border-radius:4px;white-space:pre-wrap;word-break:break-word;} .motion{color:#22d3ee;font-style:italic}</style></head><body><h1>Storyboard do Projeto</h1>`;
             Object.entries(history).forEach(([scene, prompts]) => {
                html += `<div class="scene"><h2>CENA: ${scene}</h2>`;
                (prompts as Prompt[]).forEach((prompt) => {
                    html += `<div><p>${prompt.text}</p>${prompt.motionPrompt ? `<p class="motion">Movimento: ${prompt.motionPrompt}</p>`: ''}</div>`;
                });
                html += `</div>`;
             });
             html += `</body></html>`;
             storyboardWindow.document.write(html);
             storyboardWindow.document.close();
             return;
        }

        const blob = new Blob([content], { type: blobType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jhol-pixel-history.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error("Failed to export history", e);
        alert("Falha ao exportar histórico.");
    }
  }
  
  const handleFindReplace = () => {
    if (findText) {
        onFindReplace(findText, replaceText);
        setFindText('');
        setReplaceText('');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-effect w-full max-w-2xl rounded-lg shadow-2xl flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Configurações e Ferramentas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </header>
        
        <div className="flex border-b border-white/10">
          <button onClick={() => setActiveTab('general')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'general' ? 'bg-white/10 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>Geral</button>
          <button onClick={() => setActiveTab('tools')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'tools' ? 'bg-white/10 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>Ferramentas</button>
           <button onClick={() => setActiveTab('achievements')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'achievements' ? 'bg-white/10 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>Conquistas</button>
        </div>

        <main className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-200 mb-1">Prompt Negativo</label>
                <input type="text" id="negativePrompt" value={currentSettings.negativePrompt} onChange={(e) => setCurrentSettings({ ...currentSettings, negativePrompt: e.target.value })} className="w-full bg-white/5 text-white p-2 rounded-md border border-white/20 focus:border-purple-500" placeholder="text, watermark, blurry" />
              </div>
              <div>
                <label htmlFor="globalSuffix" className="block text-sm font-medium text-gray-200 mb-1">Sufixo Global</label>
                <input type="text" id="globalSuffix" value={currentSettings.globalSuffix} onChange={(e) => setCurrentSettings({ ...currentSettings, globalSuffix: e.target.value })} className="w-full bg-white/5 text-white p-2 rounded-md border border-white/20 focus:border-purple-500" placeholder="--ar 9:16 --v 6.0" />
              </div>
            </div>
          )}
          {activeTab === 'tools' && (
            <div className="space-y-6">
                 <div>
                    <h3 className="font-semibold mb-2">Encontrar e Substituir Global</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input type="text" value={findText} onChange={e => setFindText(e.target.value)} placeholder="Encontrar texto..." className="input-neon p-2 rounded-md w-full" />
                        <input type="text" value={replaceText} onChange={e => setReplaceText(e.target.value)} placeholder="Substituir por..." className="input-neon p-2 rounded-md w-full" />
                    </div>
                    <button onClick={handleFindReplace} className="w-full mt-2 btn-secondary-neon !py-2">Executar Substituição</button>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Exportar Histórico de Prompts</h3>
                    <div className="flex gap-2">
                        <button onClick={() => handleExport('txt')} className="flex-1 btn-secondary-neon !py-2"><i className="fas fa-file-alt mr-2"></i>.txt</button>
                        <button onClick={() => handleExport('json')} className="flex-1 btn-secondary-neon !py-2"><i className="fas fa-file-code mr-2"></i>.json</button>
                        <button onClick={() => handleExport('storyboard')} className="flex-1 btn-secondary-neon !py-2"><i className="fas fa-file-pdf mr-2"></i>Storyboard</button>
                    </div>
                </div>
            </div>
          )}
          {activeTab === 'achievements' && (
            <div className="space-y-3">
              {achievements.length > 0 ? achievements.map(id => {
                const ach = getAchievement(id);
                return ach ? (
                  <div key={id} className="flex items-center gap-3 bg-white/5 p-2 rounded-md">
                    <i className={`fas ${ach.icon} text-yellow-400 text-xl`}></i>
                    <div>
                      <h4 className="font-semibold text-white">{ach.name}</h4>
                      <p className="text-sm text-gray-300">{ach.description}</p>
                    </div>
                  </div>
                ) : null;
              }) : <p className="text-center text-gray-400 py-4">Nenhuma conquista desbloqueada ainda. Continue criando!</p>}
            </div>
          )}
        </main>
        <footer className="flex justify-end p-4 border-t border-white/10 bg-black/20 rounded-b-lg">
          <button onClick={onClose} className="btn-secondary-neon !py-2 !px-4 mr-2">Cancelar</button>
          <button onClick={handleSave} className="btn-primary-neon !py-2 !px-4">Salvar</button>
        </footer>
      </div>
    </div>
  );
};
