import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const port = process.env.PORT || 10000;
  try {
    /* const app = await NestFactory.create(AppModule, {
      abortOnError: false,
    }); */
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: true, // Allow frontend origin
      credentials: true, // Allow cookies and authentication header
    });

    // Serve frontend build folder
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.useStaticAssets(frontendPath);
    app.setBaseViewsDir(frontendPath);
    //app.use(express.static(frontendPath));
    // Redirect all other routes to frontend
    app.use((req, res, next) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
    await app.listen(port);
  } catch (err) {
    console.log(err); // <-- for example, ECONNREFUSED error
  }
  /* const app = await NestFactory.create(AppModule);
  await app.listen(3000); */
}
bootstrap();
