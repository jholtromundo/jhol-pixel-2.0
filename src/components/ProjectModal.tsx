import React, { useState } from 'react';
import { ProjectState, ProjectTemplate } from '../types';

interface Props {
  projects: Record<string, ProjectState>;
  templates: Record<string, ProjectTemplate>;
  activeProjectId: string | null;
  onClose: () => void;
  onLoadProject: (projectId: string) => void;
  onCreateProject: (projectName: string, templateId?: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newName: string) => void;
}

export const ProjectModal: React.FC<Props> = ({ projects, templates, activeProjectId, onClose, onLoadProject, onCreateProject, onDeleteProject, onRenameProject }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('projects');

  const handleCreate = (templateId?: string) => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim(), templateId);
      setNewProjectName('');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-effect w-full max-w-2xl rounded-lg shadow-2xl flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Gerenciar Projetos e Templates</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </header>

         <div className="flex border-b border-white/10">
          <button onClick={() => setActiveTab('projects')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'projects' ? 'bg-white/10 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>Projetos</button>
          <button onClick={() => setActiveTab('templates')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'templates' ? 'bg-white/10 text-white neon-text-purple' : 'text-gray-400 hover:text-white'}`}>Templates</button>
        </div>

        <main className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'projects' && (
            <>
              <div className="flex gap-2">
                <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Nome do Novo Projeto" className="flex-grow input-neon p-2 rounded-md" onKeyPress={(e) => e.key === 'Enter' && handleCreate()} />
                <button onClick={() => handleCreate()} className="btn-primary-neon !py-2 !px-4" disabled={!newProjectName.trim()}>Criar</button>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold mt-4">Projetos Salvos</h3>
                {Object.entries(projects).map(([id, project]) => (
                  <div key={id} className={`p-3 rounded-md flex items-center justify-between transition-colors ${id === activeProjectId ? 'bg-purple-600/20' : 'bg-white/5'}`}>
                    {/* Rename/Display logic here */}
                    <span className="font-medium">{project.projectName}</span>
                     <div className="flex items-center gap-3">
                        <button onClick={() => onLoadProject(id)} className="text-gray-300 hover:text-white" title="Carregar"><i className="fas fa-folder-open"></i></button>
                        <button onClick={() => onDeleteProject(id)} className="text-red-400 hover:text-red-300" title="Excluir"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'templates' && (
            <>
                 <div className="flex gap-2">
                    <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Nome do Projeto a partir de template" className="flex-grow input-neon p-2 rounded-md" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold mt-4">Templates Disponíveis</h3>
                    {Object.entries(templates).map(([id, template]) => (
                      <div key={id} className="p-3 rounded-md flex items-center justify-between bg-white/5">
                        <span className="font-medium">{template.name}</span>
                        <button onClick={() => handleCreate(id)} className="btn-secondary-neon !py-1 !px-3" disabled={!newProjectName.trim()}>Usar Template</button>
                      </div>
                    ))}
                    {Object.keys(templates).length === 0 && <p className="text-gray-400 text-center py-4">Nenhum template salvo.</p>}
                </div>
            </>
          )}
        </main>

        <footer className="flex justify-end p-4 border-t border-white/10 bg-black/20 rounded-b-lg">
          <button onClick={onClose} className="btn-secondary-neon !py-2 !px-4">Fechar</button>
        </footer>
      </div>
    </div>
  );
};
