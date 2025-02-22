import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // API gửi OTP
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return this.emailService.sendOTP(email);
  }

  // API xác thực OTP
  @Post('verify-otp')
  verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return this.emailService.verifyOTP(email, otp);
  }
}
