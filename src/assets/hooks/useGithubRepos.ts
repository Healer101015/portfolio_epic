import { useState, useEffect } from 'react';

export interface Repository {
    id: number;
    name: string;
    description: string;
    html_url: string;
    homepage: string | null;
    imageUrl: string;
    topics: string[];
    owner: {
        login: string;
    };
}

export function useGithubRepos(username: string) {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const res = await fetch(`https://api.github.com/users/${username}/starred?per_page=4`);
                if (!res.ok) throw new Error('Falha ao aceder à API do GitHub');

                const data = await res.json();

                const processedRepos = await Promise.all(
                    data.map(async (repo: any) => {
                        let imageUrl = 'https://images.unsplash.com/photo-1635332353510-275da060d299?q=80&w=2070&auto=format&fit=crop';
                        let description = repo.description; // Pega a descrição original, se existir

                        try {
                            const readmeRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`);
                            if (readmeRes.ok) {
                                const readmeData = await readmeRes.json();

                                // Decodificação segura (UTF-8 / Emojis)
                                const binaryStr = atob(readmeData.content);
                                const bytes = new Uint8Array(binaryStr.length);
                                for (let i = 0; i < binaryStr.length; i++) {
                                    bytes[i] = binaryStr.charCodeAt(i);
                                }
                                const content = new TextDecoder('utf-8').decode(bytes);

                                // --- 1. EXTRAÇÃO DA IMAGEM ---
                                const imgMatch = content.match(/!\[.*?\]\(([^)]+)\)|<img[^>]+src=["']([^"']+)["']/i);
                                if (imgMatch) {
                                    let extractedUrl = imgMatch[1] || imgMatch[2];
                                    if (extractedUrl) {
                                        extractedUrl = extractedUrl.split(/\s+/)[0];
                                        if (!extractedUrl.startsWith('http://') && !extractedUrl.startsWith('https://')) {
                                            extractedUrl = extractedUrl.replace(/^(\.\/|\/)/, '');
                                            const branch = repo.default_branch || 'main';
                                            extractedUrl = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${branch}/${extractedUrl}`;
                                        }
                                        imageUrl = extractedUrl;
                                    }
                                }

                                // --- 2. EXTRAÇÃO DA DESCRIÇÃO (Caso a oficial seja null) ---
                                if (!description) {
                                    // Remove blocos de código para não pegar lixo
                                    const noCode = content.replace(/```[\s\S]*?```/g, '');
                                    const lines = noCode.split('\n');

                                    for (const line of lines) {
                                        const trimmed = line.trim();
                                        // Procura a primeira linha que tenha mais de 20 caracteres e não seja um título (#), nem imagem (!), nem tag HTML (<)
                                        if (trimmed.length > 20 && !trimmed.startsWith('#') && !trimmed.startsWith('![') && !trimmed.startsWith('<')) {
                                            // Limpa possíveis marcações de negrito/itálico básicas para o texto ficar limpo
                                            let cleanText = trimmed.replace(/[*_~`]/g, '');
                                            description = cleanText.substring(0, 160) + '...';
                                            break;
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            console.warn(`Erro ao ler README de ${repo.owner.login}/${repo.name}`);
                        }

                        return {
                            id: repo.id,
                            name: repo.name.replace(/[-_]/g, ' '),
                            // Se mesmo varrendo o README não achar nada, usa o fallback
                            description: description || 'Nenhuma descrição fornecida pelo autor no repositório.',
                            html_url: repo.html_url,
                            homepage: repo.homepage,
                            imageUrl,
                            topics: repo.topics || [],
                            owner: repo.owner
                        };
                    })
                );

                setRepos(processedRepos);
            } catch (error) {
                console.error("Erro ao carregar repositórios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [username]);

    return { repos, loading };
}