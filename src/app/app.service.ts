import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Meu primeiro projeto em Nest JS';
  }
}
