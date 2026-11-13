import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('my-ip')
  getMyIp(@Req() request: Request): { ip: string; forwardedFor: string } {
    const ip = request.ip ?? request.socket.remoteAddress;
    if (!ip) {
      throw new Error('Unable to determine client IP address');
    }

    return {
      ip,
      forwardedFor: request.get('x-forwarded-for') ?? ip,
    };
  }
}
