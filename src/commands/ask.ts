import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

export default module.exports = {
    name: "ask",
    description: "Ask ai for a question.",
    execute: async (sock: any, from: any,message: any) => {
                const apiKey = config['AI']['api_key']
                if (!apiKey) throw new Error('API_KEY not set')
                    
                const genAI = new GoogleGenerativeAI(apiKey)

                const model = genAI.getGenerativeModel({
                    model: 'gemini-1.5-flash',
                    generationConfig: {
                        temperature: 0.9
                    }
                });
                
                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: 'Hello' }] },
                        { role: 'model', parts: [{ text: 'Greet to meet you. What would you like to know?' }] },
                        { role: 'user', parts: [{ text: 'Who are you?' }] },
                        { role: 'model', parts: [{ text: 'I am MeguBot. I can help you with any question you have. What would you like to know?' }] },
                        { role: 'user', parts: [{ text: 'What is your name?' }] },
                        { role: 'model', parts: [{ text: 'My name is Megumin' }]}
                    ],
                })

                const result = await chat.sendMessage(message?.conversation.slice(4))
                console.log(result)
                sock.sendMessage(from, { text: result.response.text() })
    }
} 