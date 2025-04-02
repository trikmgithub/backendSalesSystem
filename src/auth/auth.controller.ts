import { Controller, Get, Post, Req, UseGuards, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './google-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { IUser } from 'src/users/interface/users.interface';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@ApiTags('Auth Module')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  //---------------------------------------POST: /auth/

  //---------------------------------------Logout: auth/logout
  @ResponseMessage('Logout User')
  @Post('/logout')
  handleLogout(
    //passthrough: block auto response (redirect ...)
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }

  //---------------------------------------Login: auth/login
  @Public()
  @ResponseMessage('Login success')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: UserLoginDto })
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  handleLogin(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    //@Req() req: Request
    //user = req.user
    return this.authService.login(user, response);
  }

  //---------------------------------------GET: /auth/

  //---------------------------------------Get user information: auth/account
  @ResponseMessage('Get user information')
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  //---------------------------------------Get user by refresh token: auth/refresh
  @Public()
  @ResponseMessage('Get User by refresh token')
  @Get('/refresh')
  async handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    console.log('refreshToken: ', refreshToken);
    const newRefreshToken = await this.authService.processNewToken(
      refreshToken,
      response,
    );
    return newRefreshToken;
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Google login sẽ được xử lý tự động bởi Passport
    return { message: 'Redirecting to Google login...' };
  }

  @Public()
  @Get('google/redirect')
  @ResponseMessage('Login success')
  @UseGuards(GoogleAuthGuard)
  async handleLoginGoogle(@Req() req: Request, @Res() res: Response) {
    try {
      // Xử lý thông tin người dùng từ Google
      const user = await this.authService.createGoogleUser(req.user);

      // Set refresh token in HTTP-only cookie
      res.cookie('refresh_token', user.refresh_token, {
        httpOnly: true,
        secure: true, // Required for cross-domain with sameSite=none
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        sameSite: 'none', // Required for cross-domain cookies
        path: '/',
      });

      // Set user info in JavaScript-accessible cookie with correct domain settings
      res.cookie('user_info', JSON.stringify(user), {
        // Make sure it's properly serialized
        httpOnly: false, // Allow JavaScript access
        secure: true, // Required for cross-domain with sameSite=none
        maxAge: ms('5m'), // 5 minutes expiration
        sameSite: 'none', // Required for cross-domain cookies
        path: '/',
      });

      // Tạo redirect URL với access token và thông tin user cơ bản
      const frontendUri = this.configService.get<string>('FRONTEND_URI');

      // Encode user info để tránh lỗi khi truyền trong URL
      const queryParams = new URLSearchParams(user).toString();
      console.log('queryParams', queryParams);

      return res.redirect(`${frontendUri}?${queryParams}`);
    } catch (error) {
      console.error('Error in Google login:', error);
      const frontendUri = this.configService.get<string>('FRONTEND_URI');
      return res.redirect(`${frontendUri}/auth/google-login-error`);
    }
  }
}
