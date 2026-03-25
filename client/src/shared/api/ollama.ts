const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL ?? 'llama3.2'

export const askOllama = async (prompt: string): Promise<string> => {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            system: 'Ты помощник для российского сайта объявлений. Всегда отвечай только на русском языке. Никогда не используй английские слова, даже технические термины переводи на русский. Отвечай кратко и по делу.',
            prompt,
            stream: false,
        }),
    })
    if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
    const json = await res.json()
    return json.response as string
}
