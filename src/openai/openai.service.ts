import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

@Injectable()
export class OpenaiService {
  private readonly client: OpenAI
  private readonly logger = new Logger(OpenaiService.name)

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('GROQ_API_KEY'),
      baseURL: 'https://api.groq.com/openai/v1'
    })
  }

  async analyzeIntent(userMessage: string): Promise<string> {
    this.logger.log(`Analizando intención: ${userMessage}`)

    const response = await this.client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `
Eres Pocki, un asistente virtual inteligente.

Debes analizar el mensaje del usuario y responder SOLO con UNA PALABRA en inglés:

TRM → si el usuario pregunta por:
- precio del dólar
- TRM
- tasa de cambio
- USD COP

CHAT → para cualquier otro mensaje.

Responde solo la palabra.
`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 10
    })

    const intent = response.choices[0]?.message?.content?.trim() || 'CHAT'

    this.logger.log(`Intención detectada: ${intent}`)

    return intent
  }

  async generateResponse(userMessage: string, context?: string): Promise<string> {
    this.logger.log(`Generando respuesta para: ${userMessage}`)

    const messages: any[] = [
      {
        role: 'system',
        content: `
Eres Pocki, un asistente virtual amable y útil.

Reglas:
- Responde siempre en español
- Sé claro y conciso
- Ayuda al usuario de forma natural

${context ? `Contexto adicional: ${context}` : ''}
`
      },
      {
        role: 'user',
        content: userMessage
      }
    ]

    const response = await this.client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 300
    })

    const reply =
      response.choices[0]?.message?.content?.trim() ||
      'Lo siento, no pude procesar tu mensaje.'

    return reply
  }
}