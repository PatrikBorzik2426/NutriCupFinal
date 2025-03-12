import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',  // Allow only requests from this origin
    methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization',  // Allow Content-Type and Authorization headers
    credentials: true,  // Allow cookies to be sent with requests (if needed)
  });

  app.setGlobalPrefix('unicupbackend');

  await app.listen(4444);
}
bootstrap();
