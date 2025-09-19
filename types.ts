export type ChannelId = 'dnacosmico' | 'sombrasdearkive' | 'hq' | 'bw' | 'terrorpsicologico' | 'stylegallery';
export type Language = 'pt-br' | 'en' | 'es';

export interface Style {
  id: string; // uuid
  name: string;
  prompt: string;
  tags: string[];
}

export interface GalleryStyle extends Style {
  description: string;
}

export interface Prompt {
  id: string; // uuid for key
  text: string;
  motionPrompt?: string;
  type: 'original' | 'variation' | 'scene-variation' | 'asset' | 'refined';
  parentId?: string;
  colorPalette?: string[];
  history?: { text: string; timestamp: number }[];
  confirmationNote?: string;
}

export interface Settings {
  negativePrompt: string;
  globalSuffix: string;
}

export interface SegmentationConfig {
    isAutomatic: boolean;
    sceneCount: number; // 10-40
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Represents the state of a single project
export interface ProjectState {
  step: 1 | 2 | 3;
  projectName: string;
  script: string;
  channel: ChannelId | null;
  language: Language;
  segmentationConfig: SegmentationConfig;
  segmentedScenes: string[];
  styleProposals: Style[];
  selectedStyles: Style[];
  favoriteStyles: Style[];
  promptHistory: Record<string, Prompt[]>; // Keyed by scene
  favorites: string[]; // Array of prompt texts
  chatHistory: ChatMessage[];
  selectedGalleryStyleId: string | null;
  styleGuidePrompt: string | null;
  keyScenes: Prompt[];
  pacingAnalysis: string | null;
  suggestedAssets: string[];
}

export interface ProjectTemplate {
    name: string;
    data: Partial<ProjectState>;
}

// Main application state, now manages multiple projects
export interface AppState {
  projects: Record<string, ProjectState>; // Projects stored by ID (UUID)
  activeProjectId: string | null;
  settings: Settings;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  toast: { message: string, type: 'normal' | 'achievement' } | null;
  isSettingsOpen: boolean;
  isProjectModalOpen: boolean;
  isChatting: boolean;
  projectTemplates: Record<string, ProjectTemplate>;
  achievements: string[];
}
