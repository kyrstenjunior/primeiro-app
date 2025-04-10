import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from 'src/tasks/tasks.module';

import { ConfigModule } from '@nestjs/config'; // Necessario para usar variáveis de ambiente
import { UsersModule } from 'src/users/users.module';

// Arquivo de configuração do meu app (pasta app)

@Module({
  imports: [
    TasksModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true, // Variáveis de ambiente globais
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}