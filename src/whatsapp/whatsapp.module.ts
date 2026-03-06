import { Module } from '@nestjs/common'
import { WhatsappController } from './whatsapp.controller'
import { WhatsappService } from './whatsapp.service'
import { OpenaiModule } from '../openai/openai.module'
import { ToolsModule } from '../tools/tools.module'
import { MessagesModule } from '../messages/messages.module'

@Module({
  imports: [OpenaiModule, ToolsModule, MessagesModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}