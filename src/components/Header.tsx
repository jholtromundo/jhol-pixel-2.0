import React from 'react';

interface HeaderProps {
  projectName: string;
  onOpenProjects: () => void;
  onOpenSettings: () => void;
  onSaveAsTemplate: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ projectName, onOpenProjects, onOpenSettings, onSaveAsTemplate }) => {
  const handleSaveTemplate = () => {
    const name = prompt("Digite um nome para este template:", `${projectName} Template`);
    if (name) {
      onSaveAsTemplate(name);
    }
  };
  
  return (
    <header className="glass-effect flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg mb-6 gap-4">
      <div className="flex items-center gap-3">
        <i className="fas fa-robot text-purple-400 text-2xl neon-text-purple"></i>
        <h1 className="text-xl md:text-2xl font-bold neon-text-purple p-1 rounded-md">
            {projectName}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
         <button 
          onClick={handleSaveTemplate}
          className="p-2 w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          title="Salvar como Template"
          aria-label="Salvar como Template"
         >
          <i className="fas fa-save"></i>
         </button>
         <button 
          onClick={onOpenProjects} 
          className="p-2 w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          title="Gerenciar Projetos"
          aria-label="Gerenciar Projetos"
        >
          <i className="fas fa-project-diagram"></i>
        </button>
        <button 
          onClick={onOpenSettings} 
          className="p-2 w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          title="Configurações"
          aria-label="Configurações"
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </header>
  );
};
