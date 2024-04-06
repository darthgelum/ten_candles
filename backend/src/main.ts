import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WorkerModule } from './worker.module';
import { WorkerService } from './worker.service';
// import { AppService } from './app.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {

  NestFactory.create(AppModule).then((app) => {
    const ws = app.get(WorkerService, { strict: false })
    ws.start()
    app.enableCors({ origin: true })
    app.listen(3000)
  })
}
bootstrap();
