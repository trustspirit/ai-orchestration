import { Injectable } from '@nestjs/common';
import { WELCOME_MESSAGE } from '@repo/shared';

@Injectable()
export class AppService {
  getHello(): string {
    return WELCOME_MESSAGE;
  }
}
