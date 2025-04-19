import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from 'src/tasks/tasks.module';

import { ConfigModule } from '@nestjs/config'; // Necessario para usar variáveis de ambiente
import { UsersModule } from 'src/users/users.module';

import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware'; // Importando o middleware
import { AuthModule } from 'src/auth/auth.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

// Arquivo de configuração do meu app (pasta app)

@Module({
  imports: [
    ConfigModule.forRoot(),
    TasksModule,
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'files'),
      serveRoot: "/files"
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Posso usar um guard aqui para todo o meu APP
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthAdminGuard
    // }
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}