import { Controller, Get, Post, Query, Body, Res, Logger } from '@nestjs/common'
import { type Response } from 'express'
import { WhatsappService } from './whatsapp.service'

@Controller('webhook')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name)

  constructor(private readonly whatsappService: WhatsappService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const isValid = this.whatsappService.verifyToken(mode, token, challenge)

    if (isValid) {
      this.logger.log('Webhook verificado')
      return res.status(200).send(challenge)
    }

    this.logger.warn('Token inválido en verificación')
    return res.status(403).send('Token inválido')
  }

  @Post()
  async receiveMessage(@Body() body: any) {
    this.logger.log(`WEBHOOK BODY: ${JSON.stringify(body)}`)

    try {
      await this.whatsappService.handleMessage(body)
      return { status: 'ok' }
    } catch (error) {
      this.logger.error('Error procesando webhook', error)
      return { status: 'error' }
    }
  }
}