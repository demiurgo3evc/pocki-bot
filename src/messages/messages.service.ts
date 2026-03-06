import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from './message.entity'

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name)

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async saveMessage(
    from: string,
    userMessage: string,
    botResponse: string,
    intent: string,
  ): Promise<void> {
    const message = this.messageRepo.create({
      from,
      userMessage,
      botResponse,
      intent,
    })
    await this.messageRepo.save(message)
    this.logger.log(`💾 Mensaje guardado en DB de ${from}`)
  }

  async getHistory(from: string): Promise<Message[]> {
    return this.messageRepo.find({
      where: { from },
      order: { createdAt: 'DESC' },
      take: 10,
    })
  }
}