/* import { NestFactory } from '@nestjs/core';
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
    }); 
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: true, // Allow frontend origin
      credentials: true, // Allow cookies and authentication header
    });

    // Serve frontend build folder
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    //app.useStaticAssets(frontendPath);
    //app.setBaseViewsDir(frontendPath);
    app.use(express.static(frontendPath));
    // Redirect all other routes to frontend
    app.use((req, res, next) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../../frontend/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist'));
      });
    }
    await app.listen(port);
  } catch (err) {
    console.log(err); // <-- for example, ECONNREFUSED error
  }
  
}
bootstrap();
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const port = process.env.PORT || 10000;
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Middleware
    app.use(cookieParser());
    app.enableCors({
      origin: true, // Allow frontend origin
      credentials: true, // Allow cookies and authentication headers
    });

    // Serve static files from the frontend build folder
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));

    // Redirect all non-API routes to the frontend
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) {
        // Skip API routes
        next();
      } else {
        // Serve the frontend's index.html for all other routes
        res.sendFile(path.join(frontendPath, 'index.html'));
      }
    });

    // Start the server
    await app.listen(port);
    console.log(`Server running on port ${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
  }
}

bootstrap();
