import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from 'src/decorator/customize';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // API gửi OTP
  @Public()
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return this.emailService.sendOTP(email);
  }

  // API xác thực OTP
  @Public()
  @Post('verify-otp')
  verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return this.emailService.verifyOTP(email, otp);
  }

  
}
