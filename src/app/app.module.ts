import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from 'src/tasks/tasks.module';

// Arquivo de configuração do meu app (pasta app)

@Module({
  imports: [TasksModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}