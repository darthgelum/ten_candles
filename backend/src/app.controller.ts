import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Req() req: Request, @Res() res: Response): string {
    res.status(200).sendFile(__dirname + "/public/index.html")
    return this.appService.getHello();
  }
}
