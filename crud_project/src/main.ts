import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global validation pipe validating incoming requests bodies automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      disableErrorMessages: false, //` Enable detailed error messages (useful for development)
      skipUndefinedProperties: true, // Skip validation for properties that are undefined
    }),
  ); // You can add global pipes or other middleware here  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
