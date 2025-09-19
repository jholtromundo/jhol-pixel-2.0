import { GoogleGenAI, Type } from "@google/genai";
import { Style, Language, ChannelId } from '../types';
import { JHOLTROMUNDO_STYLES } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const callGemini = async (prompt: string, schema?: any, retries = 3): Promise<string> => {
    try {
        const config = schema ? { responseMimeType: "application/json", responseSchema: schema } : {};
        const response = await ai.models.generateContent({ model, contents: prompt, config });
        // Use the new .text accessor
        return response.text;
    } catch (error) {
        console.error(`Error calling Gemini API (retries left: ${retries}):`, error);
        if (retries > 0) {
            await new Promise(res => setTimeout(res, 1500)); // wait before retrying
            return callGemini(prompt, schema, retries - 1);
        }
        throw new Error("Falha na comunicação com o modelo de IA após várias tentativas. Verifique o console.");
    }
};

export const segmentScript = async (script: string, isAutomatic: boolean, sceneCount: number, language: Language): Promise<string[]> => {
    const languageMap = { 'pt-br': 'Português do Brasil', 'en': 'Inglês', 'es': 'Espanhol' };
    const segmentationInstruction = isAutomatic
        ? `Divida o roteiro em pelo menos 15 cenas, usando a pontuação (especialmente pontos finais) como guia principal.`
        : `Divida o roteiro em exatamente ${sceneCount} cenas.`;

    const prompt = `
        Sua tarefa é segmentar o roteiro de vídeo a seguir.
        VOCÊ NÃO DEVE REESCREVER, RESUMIR OU ALTERAR O CONTEÚDO ORIGINAL. Apenas divida o texto existente.
        ${segmentationInstruction}
        O resultado deve ser um array JSON de strings no idioma ${languageMap[language]}.

        Roteiro: "${script}"
    `;
    const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
};

const getChannelStylePrompt = (channelId: ChannelId) => {
    switch (channelId) {
        case 'sombrasdearkive':
            return `Sua missão é ser um diretor de arte para o canal 'Sombras de Arkive', um universo que funde 'sketchy psychological horror cartoon' com a estética de 'dark graphic novel' e 'analog horror'. Sua tarefa é criar propostas de estilo que sejam inovadoras, surpreendentes e profundamente alinhadas com essa identidade visual. Use os seguintes pilares como inspiração, mas NUNCA os copie diretamente. O objetivo é a originalidade radical dentro deste nicho:\n\n- **Estilo de Arte:** As propostas devem evocar um estilo de 'sketch' ou esboço, com linhas expressivas e uma sensação de tensão. Pense em 'creepy animated style' e 'graphic novel horror'.\n- **Iluminação e Cor:** Alto contraste é essencial. Sombras pesadas e escuridão devem ser quebradas por brilhos de neon (roxo, vermelho, verde-doentio) e luzes fluorescentes piscando.\n- **Textura e Efeitos:** Incorpore elementos de 'analog horror', como ruído de VHS, 'glitch effects' e aberração cromática, para dar uma sensação de mídia encontrada ou corrompida.\n- **Temas Centrais:** Foque em conspirações (estilo SCP), experimentos científicos blasfemos, horror corporal, figuras misteriosas com olhos negros ou brilhantes, e o surreal invadindo cenários mundanos (laboratórios secretos, becos urbanos decadentes, o sertão brasileiro).\n- **Composição:** As propostas devem sugerir enquadramentos cinematográficos que maximizem o suspense e a paranoia.\n\nSeja ousado e experimental. Combine o inesperado. Evite clichês de terror. Foque no estranho, no perturbador e no psicologicamente denso.`;
        case 'hq':
            return `na estética de "histórias em quadrinhos (HQ), com arte de linha ousada, cores vibrantes e um toque cinematográfico".`;
        case 'bw':
            return `na estética de "preto e branco cartoonizado e surreal". Explore temas de horror cósmico, contos de fadas sombrios e designs de personagens estilizados. O resultado deve ser altamente contrastado, com iluminação dramática (film noir), e focar em texturas e sombras expressivas.`;
        case 'terrorpsicologico':
            return `na estética de "terror psicológico com um estilo de arte cartoon/HQ". Foco em suspense, atmosfera opressiva, e designs de personagens perturbadores que exploram medos internos e ansiedade. Use linhas expressivas, sombras profundas e uma paleta de cores limitada para criar tensão.`;
        case 'dnacosmico':
        default:
             return `na estética de "realismo cinematográfico, 4k, e temas de conspiração".`;
    }
}

export const generateStyles = async (script: string, channelId: ChannelId): Promise<Omit<Style, 'id'>[]> => {
    const aestheticPrompt = getChannelStylePrompt(channelId);
    
    let predefinedStyles: Omit<Style, 'id'>[] = [];
    let numberOfStylesToGenerate = 10;

    if (channelId === 'sombrasdearkive') {
        predefinedStyles = JHOLTROMUNDO_STYLES;
        numberOfStylesToGenerate = 10 - predefinedStyles.length;
    }

    if (numberOfStylesToGenerate <= 0) {
        return predefinedStyles;
    }
    
    const prompt = `
        Sua tarefa é ser um diretor de arte visionário. Crie ${numberOfStylesToGenerate} propostas de estilo visual RADICALMENTE DIFERENTES e altamente criativas, baseadas no roteiro fornecido e ${aestheticPrompt}.
        
        Evite propostas genéricas ou clichês. Cada uma das ${numberOfStylesToGenerate} propostas deve ser uma visão artística única, ousada e inesquecível. Pense em surrealismo, experimentalismo, combinações de mídias inesperadas e estéticas de nicho. Surpreenda-me com sua originalidade e profundidade.

        Para cada proposta, forneça:
        1. Um nome criativo e evocativo em português.
        2. Um prompt de estilo detalhado, poderoso e poético em inglês, que capture a essência da estética. Use adjetivos fortes e referências artísticas se necessário.
        3. 3 a 5 tags de palavra-chave em inglês que encapsulem o núcleo do estilo.

        Gere as ${numberOfStylesToGenerate} propostas em formato de array JSON.
        Roteiro: "${script}"`;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                prompt: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["name", "prompt", "tags"]
        }
    };
    const responseText = await callGemini(prompt, schema);
    const generatedStyles = JSON.parse(responseText);
    
    return [...predefinedStyles, ...generatedStyles];
};


export const generateStyleVariations = async (originalStyle: Style): Promise<Omit<Style, 'id'>[]> => {
    const prompt = `Gere 3 novas variações da seguinte proposta de estilo. Mantenha o nome e o tema central, mas explore diferentes nuances visuais e artísticas no prompt detalhado em inglês e nas tags. Retorne como um array JSON. Estilo Original: ${JSON.stringify({name: originalStyle.name, prompt: originalStyle.prompt, tags: originalStyle.tags})}`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                prompt: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["name", "prompt", "tags"]
        }
    };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
};

const getStylePrompt = async (styles: Style[], mixPercentages?: { [id: string]: number }): Promise<string> => {
    if (styles.length === 1) {
        return styles[0].prompt;
    }
    if (styles.length > 1) {
        const influence1 = mixPercentages ? mixPercentages[styles[0].id] || 50 : 50;
        const influence2 = 100 - influence1;
        const prompt = `Crie um novo prompt de estilo visual em inglês que mescle de forma coesa e criativa as estéticas dos seguintes prompts. A mescla deve ter aproximadamente ${influence1}% de influência do Prompt 1 e ${influence2}% de influência do Prompt 2.\n\n- Prompt 1: "${styles[0].prompt}"\n- Prompt 2: "${styles[1].prompt}"\n\nO resultado deve ser um único prompt de estilo detalhado. Retorne apenas o texto do prompt mesclado.`;
        return await callGemini(prompt);
    }
    return "cinematic realism, 4k, detailed, dramatic lighting, sharp focus"; // Default fallback
}

export const generatePromptsForScene = async (fullScript: string, scene: string, styles: Style[], negativePrompt: string, globalSuffix: string, styleGuidePrompt: string | null): Promise<string[]> => {
    const finalNegative = negativePrompt ? `--no ${negativePrompt}` : '';
    let styleInstruction: string;
    
    // For simplicity, we'll return a string array. The confirmation note logic is complex for this step.
    if (styleGuidePrompt) {
        styleInstruction = `ESTILO GUIA A SER SEGUIDO FIELMENTE: "${styleGuidePrompt}"`;
    } else {
        const baseStylePrompt = await getStylePrompt(styles);
        styleInstruction = `ESTILO A SEGUIR: "${baseStylePrompt}"`;
    }

    const prompt = `
        CONTEXTO DO ROTEIRO: "${fullScript}"
        CENA PARA VISUALIZAR: "${scene}"
        ${styleInstruction}

        Sua tarefa é criar 3 prompts de imagem distintos e detalhados em inglês para a CENA, seguindo estritamente o ESTILO.
        Ao final de cada prompt, adicione "${globalSuffix} ${finalNegative}".
        Retorne os 3 prompts como um array JSON de strings.
    `;
    const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
};

export const generateVariations = async (originalPrompt: string, count: number): Promise<string[]> => {
    const prompt = `Gere ${count} novas variações numeradas do seguinte prompt de imagem, mantendo o mesmo tema e estilo, mas alterando detalhes como ângulo da câmera, composição ou iluminação. Retorne como um array JSON de strings. Prompt Original: "${originalPrompt}"`;
     const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
};

export const generateSceneVariation = async (originalPrompt: string): Promise<string[]> => {
    const prompt = `Crie uma variação de cena para o prompt de imagem a seguir. Mantenha o sujeito e o estilo principal, mas mude drasticamente a composição, o ângulo da câmera ou o ambiente para criar uma imagem visualmente diferente, mas tematicamente conectada. Retorne como um array JSON de uma única string. Prompt Original: "${originalPrompt}"`;
    const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
}

export const generateMotionPrompt = async (imagePrompt: string, fullScript: string): Promise<string> => {
    const prompt = `
        Baseado no contexto do roteiro e no prompt de imagem a seguir, crie um prompt de movimento para animar a imagem.
        O prompt deve ser descritivo, em INGLÊS, e focar em movimentos que façam sentido para a narrativa (ex: "slow zoom in on the artifact", "camera pans left to reveal a shadow", "subtle dust particles floating in the light").
        O prompt de movimento deve ter no máximo 950 caracteres.
        Retorne apenas o texto do prompt de movimento.

        Roteiro: "${fullScript}"
        Prompt de Imagem: "${imagePrompt}"
    `;
    return await callGemini(prompt);
};

export const generateMotionVariation = async (originalMotionPrompt: string): Promise<string> => {
    const prompt = `
        Gere uma variação criativa do seguinte prompt de movimento, mantendo o mesmo tema mas alterando a dinâmica, velocidade ou tipo de movimento da câmera.
        Retorne apenas o texto do novo prompt de movimento.

        Prompt Original: "${originalMotionPrompt}"
    `;
    return await callGemini(prompt);
};

export const generateAssetsForScene = async (originalPrompt: string): Promise<string[]> => {
    const prompt = `
        Analise o seguinte prompt de imagem para identificar o personagem ou objeto principal.
        Sua tarefa é gerar 2 novos prompts de imagem que isolem esse sujeito principal.
        Cada prompt deve descrever o sujeito em uma pose ligeiramente diferente, com um fundo de cor sólida e contrastante (como 'plain green background' ou 'solid gray background') para facilitar a remoção do fundo.
        Mantenha o estilo visual do prompt original.
        Retorne o resultado como um array JSON de 2 strings.

        Prompt Original: "${originalPrompt}"
    `;
    const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
};

export const refinePrompt = async (originalPrompt: string, modificationRequest: string): Promise<string> => {
    const prompt = `
        Sua tarefa é refinar um prompt de imagem existente com base em uma solicitação de modificação.
        Mantenha o núcleo, o sujeito e o estilo do prompt original, mas incorpore a modificação de forma coesa.
        Preserve quaisquer parâmetros técnicos no final (como --ar, --v, --style, etc.).
        Retorne apenas o novo prompt de imagem como uma única string.

        PROMPT ORIGINAL: "${originalPrompt}"
        MODIFICAÇÃO SOLICITADA: "${modificationRequest}"
    `;
    return await callGemini(prompt);
};

// --- GOD MODE UPGRADES ---

export const extractColorPalette = async (promptText: string): Promise<string[]> => {
    const prompt = `Analise o texto do prompt a seguir e extraia as 5 cores mais representativas mencionadas ou implícitas nele. Retorne um array JSON de 5 strings contendo os códigos hexadecimais (ex: "#FFFFFF"). Se nenhuma cor for óbvia, infira uma paleta baseada na atmosfera (ex: 'dark and moody' -> tons escuros). Prompt: "${promptText}"`;
    const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
};

export const analyzeScriptPacing = async (script: string): Promise<string> => {
    const prompt = `Analise o ritmo e a estrutura narrativa do roteiro a seguir. Forneça um breve insight (2-3 frases) sobre o ritmo. Por exemplo, identifique se há seções de ação rápida, momentos de calma, ou um crescendo de tensão, e sugira como a direção visual pode acentuar isso. Retorne apenas o texto do insight. Roteiro: "${script}"`;
    return await callGemini(prompt);
};

export const findRecurringElements = async (script: string): Promise<string[]> => {
    const prompt = `Analise o roteiro a seguir e identifique até 3 personagens, objetos ou locais que são mencionados repetidamente e parecem importantes para a narrativa. Estes são candidatos a se tornarem "Assets". Retorne um array JSON de strings com os nomes desses elementos. Ex: ["a espada antiga", "o protagonista de capuz", "a torre flutuante"]. Roteiro: "${script}"`;
    const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
};

export const getRefinementSuggestions = async (promptText: string): Promise<string[]> => {
    const prompt = `Dado o prompt de imagem a seguir, sugira 3 modificações criativas e curtas (2-4 palavras cada) que poderiam alterar a imagem de forma interessante. Pense em iluminação, ângulo da câmera, atmosfera ou elementos. Retorne um array JSON de 3 strings. Ex: ["Adicionar neblina", "Mudar para noite", "Ângulo de baixo para cima"]. Prompt: "${promptText}"`;
    const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    const responseText = await callGemini(prompt, schema);
    return JSON.parse(responseText);
};
