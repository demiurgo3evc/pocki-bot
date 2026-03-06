import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OpenaiService } from '../openai/openai.service'
import { ToolsService } from '../tools/tools.service'
import { MessagesService } from '../messages/messages.service'
import axios, { AxiosError } from 'axios'

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly openaiService: OpenaiService,
    private readonly toolsService: ToolsService,
    private readonly messagesService: MessagesService,
  ) {}

  verifyToken(mode: string, token: string, challenge: string): boolean {
    const verifyToken = this.config.get('WHATSAPP_VERIFY_TOKEN')
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Webhook verificado correctamente')
      return true
    }
    this.logger.warn('Token de verificación inválido')
    return false
  }

  async handleMessage(body: any): Promise<void> {
    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const message = changes?.value?.messages?.[0]

    if (!message) return

    const from = message.from
    const text = message.text?.body

    if (!text) return

    this.logger.log(`Mensaje de ${from}: ${text}`)

    // 1. Analizar intención
    const intent = await this.openaiService.analyzeIntent(text)

    // 2. Ejecutar tool o generar respuesta
    let response = ''
    if (intent === 'TRM') {
      response = await this.toolsService.getTRM()
    } else {
      response = await this.openaiService.generateResponse(text)
    }

    // 3. Guardar en base de datos
    await this.messagesService.saveMessage(from, text, response, intent)

    // 4. Enviar respuesta por WhatsApp
    await this.sendMessage(from, response)
  }

  private async sendMessage(to: string, message: string): Promise<void> {
    const token = this.config.get('WHATSAPP_TOKEN')
    const phoneId = this.config.get('WHATSAPP_PHONE_ID')

    try {
      await axios.post(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      this.logger.log(`✅ Mensaje enviado a ${to}`)
    } catch (error) {
       const axiosError = error as AxiosError
      this.logger.error('Error enviando mensaje:', axiosError.response?.data)
     
    }
  }
}