import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from './google-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { IUser } from 'src/users/interface/users.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth Module')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMessage('Login success')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  handleLogin(@User() user: IUser) {
    //@Req() req: Request
    //user = req.user
    return this.authService.login(user);
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
