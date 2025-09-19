import { ChannelId, Language, GalleryStyle } from "./types";
import { Style } from './types';

export const CHANNELS: { id: ChannelId, name: string, description: string }[] = [
    { 
        id: 'dnacosmico', 
        name: '@dnacosmico', 
        description: 'Realismo cinematográfico, 4K, temas de conspiração.' 
    },
    { 
        id: 'sombrasdearkive', 
        name: '@sombrasdearkive', 
        description: 'Terror estilizado, graphic novel, cartoon sombrio.' 
    },
    {
        id: 'hq',
        name: 'HQ (Quadrinhos)',
        description: 'Estilo de histórias em quadrinhos, cores vibrantes, arte de linha ousada.'
    },
    {
        id: 'bw',
        name: 'Preto & Branco',
        description: 'Estilo cartoon surreal, horror cósmico, e contos de fadas sombrios.'
    },
    {
        id: 'terrorpsicologico',
        name: 'Terror Psicológico',
        description: 'Horror psicológico com estilo cartoon/HQ, focado em suspense e atmosfera.'
    },
    {
        id: 'stylegallery',
        name: 'Galeria de Estilos',
        description: 'Explore 10 estilos artísticos únicos e experimentais pré-definidos.'
    }
];

export const GALLERY_STYLES: GalleryStyle[] = [
    {
        id: 'ghibli-steampunk',
        name: 'Ghibli Steampunk',
        description: 'Mundos encantadores e nostálgicos com tecnologia a vapor e engrenagens complexas.',
        prompt: 'Studio Ghibli inspired, steampunk aesthetic, intricate clockwork details, warm and nostalgic color palette, cinematic lighting, detailed environments, whimsical characters',
        tags: ['ghibli', 'steampunk', 'whimsical', 'nostalgic']
    },
    {
        id: 'art-deco-noir',
        name: 'Art Deco Noir',
        description: 'Elegância sombria com formas geométricas, alto contraste e uma atmosfera de mistério.',
        prompt: 'Art deco noir film, dramatic chiaroscuro lighting, geometric patterns, sharp angles, high contrast black and white with hints of gold, femme fatale silhouette, mysterious atmosphere',
        tags: ['art deco', 'noir', 'high-contrast', 'geometric']
    },
    {
        id: 'cosmic-watercolor',
        name: 'Aquarela Cósmica',
        description: 'Nebulosas vibrantes e galáxias etéreas pintadas com a fluidez da aquarela.',
        prompt: 'Cosmic watercolor painting, vibrant nebulas, ethereal galaxies, ink wash effects, salt texture on wet paper, deep indigos and brilliant magentas, loose and expressive style',
        tags: ['watercolor', 'cosmic', 'ethereal', 'vibrant']
    },
    {
        id: 'cyber-baroque',
        name: 'Cyber-Barroco',
        description: 'O ornamentado encontra o tecnológico. Detalhes rococó com implantes cibernéticos.',
        prompt: 'Cyber-baroque, ornate rococo details fused with futuristic cybernetics, opulent gold and neon lights, complex filigree, dramatic and theatrical composition, hyper-detailed',
        tags: ['baroque', 'cyberpunk', 'ornate', 'futuristic']
    },
    {
        id: 'modern-ukiyo-e',
        name: 'Ukiyo-e Moderno',
        description: 'Estampa de bloco de madeira japonesa com temas e personagens contemporâneos.',
        prompt: 'Modern Ukiyo-e woodblock print style, bold outlines, flat areas of color, contemporary subjects, elegant composition inspired by masters like Hokusai and Hiroshige',
        tags: ['ukiyo-e', 'japanese', 'woodblock', 'modern']
    },
    {
        id: 'digital-clay',
        name: 'Escultura de Argila Digital',
        description: 'Personagens adoráveis e texturizados que parecem feitos de argila de modelar.',
        prompt: 'Digital claymation style, cute characters made of modeling clay, visible fingerprints and textures, stop-motion look, vibrant and playful colors, soft lighting',
        tags: ['claymation', 'cute', 'textured', '3d']
    },
    {
        id: 'anarchic-collage',
        name: 'Colagem Anárquica',
        description: 'Recortes de revistas, tipografia ousada e uma atitude punk rock crua.',
        prompt: 'Anarchic collage style, ripped paper, punk zine aesthetic, ransom note typography, grainy textures, chaotic and energetic composition, mixed media elements',
        tags: ['collage', 'punk', 'chaotic', 'mixed-media']
    },
    {
        id: 'isometric-pixel-art',
        name: 'Pixel Art Isométrico',
        description: 'Mundos detalhados e nostálgicos em uma perspectiva isométrica de 16 bits.',
        prompt: 'Detailed 16-bit isometric pixel art, vibrant color palette, clean lines, charming characters and environments, retro video game aesthetic, meticulous details',
        tags: ['pixel art', 'isometric', 'retro', '16-bit']
    },
    {
        id: 'radiant-solarpunk',
        name: 'Solarpunk Radiante',
        description: 'Futuro otimista onde a natureza e a tecnologia sustentável coexistem em harmonia.',
        prompt: 'Radiant solarpunk aesthetic, lush greenery integrated with futuristic architecture, art nouveau influences, bright and optimistic lighting, sustainable technology, community focus',
        tags: ['solarpunk', 'utopian', 'sustainable', 'optimistic']
    },
    {
        id: 'gothic-linocut',
        name: 'Gravura Gótica',
        description: 'Xilogravura de alto contraste com temas sombrios, inspirada na arte medieval e gótica.',
        prompt: 'Gothic linocut print, high contrast black and white, stark and expressive lines, woodcut texture, dark fantasy themes, medieval art influence, dramatic and raw style',
        tags: ['linocut', 'gothic', 'high-contrast', 'dark-fantasy']
    }
];


export const LANGUAGES: { id: Language, name: string }[] = [
    { id: 'pt-br', name: 'Português (Brasil)' },
    { id: 'en', name: 'Inglês' },
    { id: 'es', name: 'Espanhol' },
];

export const JHOLTROMUNDO_STYLES: Omit<Style, 'id'>[] = [
    {
        name: 'Padrão 1: Tinta Surrealista',
        prompt: `Dark graphic novel horror illustration, surreal dream-like aesthetic, rendered in high-contrast B&W ink with bold sketchy outlines. Focus on creating a haunting, unsettling psychological tension, with glitching neon strokes for accent lighting on decaying high-tech or biomechanical elements.`,
        tags: ['graphic-novel', 'horror', 'b&w', 'surreal', 'sketchy']
    },
    {
        name: 'Padrão 2: Cartoon Sombrio',
        prompt: `Black and white dark cartoon illustration, graphic novel horror style. Emphasizes high contrast, heavy ink shadows, and a creepy atmosphere. Features characters with exaggerated expressions and glowing eyes, with highly detailed linework and textured shading to create a psychological horror mood.`,
        tags: ['cartoon', 'b&w', 'graphic-novel', 'horror', 'high-contrast']
    }
];

export const MOTIVATIONAL_TIPS: string[] = [
    "A criatividade é a inteligência se divertindo.",
    "O único modo de fazer um ótimo trabalho é amar o que você faz.",
    "A persistência realiza o impossível.",
    "Comece onde você está. Use o que você tem. Faça o que você pode.",
    "Grandes coisas nunca vêm de zonas de conforto.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Acredite que você pode e você já está no meio do caminho.",
    "A jornada de mil quilômetros começa com um único passo.",
    "Não tenha medo de desistir do bom para perseguir o ótimo.",
    "Sua limitação é apenas a sua imaginação.",
    "Empurre-se, porque ninguém mais vai fazer isso por você.",
    "Às vezes, 'mais tarde' se torna 'nunca'. Faça agora.",
    "Sonhe. Acredite. Conquiste.",
    "O segredo para ir em frente é começar.",
    "A disciplina é la ponte entre metas e realizações.",
    "Falhar é a oportunidade de começar de novo, com mais inteligência.",
    "A inspiração existe, mas ela precisa te encontrar trabalhando.",
    "Cada frame é uma tela em branco. Pinte sua obra-prima."
];

export const SHOWCASE_PROMPTS: GalleryStyle[] = [
    {
        id: 'showcase-1',
        name: 'Fantasia Etérea',
        description: 'Um estilo de fantasia sonhador e luminoso, perfeito para contos de fadas modernos.',
        prompt: 'ethereal fantasy, soft focus, god rays, intricate glowing runes, bioluminescent flora and fauna, detailed character design with flowing garments, style of Yoshitaka Amano, cinematic, hyperrealistic',
        tags: ['fantasy', 'ethereal', 'luminous', 'dreamy']
    },
    {
        id: 'showcase-2',
        name: 'Sci-Fi Hard-Surface',
        description: 'Foco em realismo, detalhes mecânicos e uma atmosfera de ficção científica fundamentada.',
        prompt: 'hard-surface sci-fi, detailed mechanical parts, realistic textures, brushed metal, exposed wiring, volumetric lighting, industrial aesthetic, cinematic composition, octane render, 8k',
        tags: ['sci-fi', 'realistic', 'industrial', 'detailed']
    },
    {
        id: 'showcase-3',
        name: 'Horror Analógico Retrô',
        description: 'A estética granulada e perturbadora de fitas VHS encontradas e tecnologia antiga.',
        prompt: '80s analog horror, VHS tape artifacts, screen tearing, glitch effects, chromatic aberration, found footage style, unsettling atmosphere, liminal spaces, dark and grainy',
        tags: ['horror', 'analog', 'retro', 'found-footage']
    }
];
