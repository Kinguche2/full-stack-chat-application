import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 10000;
  try {
    const app = await NestFactory.create(AppModule, {
      abortOnError: false,
    });
    app.use(cookieParser());
    app.enableCors();
    await app.listen(port);
  } catch (err) {
    console.log(err); // <-- for example, ECONNREFUSED error
  }
  /* const app = await NestFactory.create(AppModule);
  await app.listen(3000); */
}
bootstrap();
