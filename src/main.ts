import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: any, res: any, next: any) => {
    res.setHeader('ngrok-skip-browser-warning', 'true')
    next()
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
