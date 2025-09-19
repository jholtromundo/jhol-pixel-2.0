import { AppState } from './types';

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    check: (state: AppState) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'FIRST_PROMPTS',
        name: 'Primeiro Passo',
        description: 'Gerou seu primeiro conjunto de prompts para uma cena.',
        icon: 'fa-lightbulb',
        check: (state) => {
            const project = state.projects[state.activeProjectId!];
            return project && Object.keys(project.promptHistory).length > 0;
        }
    },
    {
        id: 'CINEAST',
        name: 'Cineasta',
        description: 'Gerou mais de 50 prompts em um único projeto.',
        icon: 'fa-film',
        check: (state) => {
            const project = state.projects[state.activeProjectId!];
            if (!project) return false;
            const totalPrompts = Object.values(project.promptHistory).reduce((acc, prompts) => acc + prompts.length, 0);
            return totalPrompts >= 50;
        }
    },
    {
        id: 'STYLE_MIXER',
        name: 'Mestre dos Estilos',
        description: 'Mesclou dois estilos visuais pela primeira vez.',
        icon: 'fa-blender',
        check: (state) => {
             const project = state.projects[state.activeProjectId!];
             return project?.selectedStyles.length > 1 && project.step === 3;
        }
    },
    {
        id: 'TEMPLATE_MASTER',
        name: 'Visionário',
        description: 'Salvou seu primeiro template de projeto.',
        icon: 'fa-save',
        check: (state) => Object.keys(state.projectTemplates).length > 0
    },
    {
        id: 'POWER_USER',
        name: 'Usuário Avançado',
        description: 'Usou uma Cena Chave para gerar novos prompts.',
        icon: 'fa-key',
        check: (state) => {
            // This would require more complex logic to track if generation was triggered from a key scene
            // For now, we can award it when a key scene is created.
            const project = state.projects[state.activeProjectId!];
            return project?.keyScenes.length > 0;
        }
    },
];

export const getAchievement = (id: string): Achievement | undefined => {
    return ACHIEVEMENTS.find(a => a.id === id);
}

export const checkAndAwardAchievements = (state: AppState): string[] => {
    if (!state.activeProjectId) return [];

    const unlocked = ACHIEVEMENTS
        .filter(ach => !state.achievements.includes(ach.id))
        .filter(ach => ach.check(state))
        .map(ach => ach.id);
        
    return unlocked;
};
