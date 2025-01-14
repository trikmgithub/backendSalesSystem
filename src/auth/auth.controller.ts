import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './google-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMessage('Login success')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Google login sẽ được xử lý tự động bởi Passport
    return { message: 'Redirecting to Google login...' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleLoginGoogle(@Req() req: Request) {
    // req.user sẽ chứa thông tin người dùng đã được Google trả về
    return this.authService.validateGoogleUser(req.user);
  }
}
