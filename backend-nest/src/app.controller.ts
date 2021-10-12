import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res) {
    //return this.appService.getHello();
    res.redirect("http://ec2-13-244-75-255.af-south-1.compute.amazonaws.com:3000/index.html");
  }
}
