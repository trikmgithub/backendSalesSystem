import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './google-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}
  

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Google login sẽ được xử lý tự động bởi Passport
    return { message: 'Redirecting to Google login...' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleLogin(@Req() req: Request) {
    // req.user sẽ chứa thông tin người dùng đã được Google trả về
    return this.authService.validateGoogleUser(req.user);
  }
}
