import { Controller, Get, HttpException, Query, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index() {
    return 'index';
  }

  @Get('testExpection')
  testExpection() {
    throw new HttpException('ces', 200);
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
}