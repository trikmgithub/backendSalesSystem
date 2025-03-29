import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { SendInvoiceDto } from './dto/send-invoice.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // API gửi OTP
  @Public()
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return this.emailService.sendOTP(email);
  }

  // API gửi OTP
  @Public()
  @ResponseMessage('Send OTP for forget password successfully')
  @Post('send-otp-forget-password')
  async sendOtpForgetPassword(@Body('email') email: string) {
    return this.emailService.sendOtpForgetPassword(email);
  }

  // API xác thực OTP
  @Public()
  @Post('verify-otp')
  verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return this.emailService.verifyOTP(email, otp);
  }

  // API gửi hóa đơn qua email
  @ResponseMessage('Send invoice via email successfully')
  @Post('send-invoice')
  async sendInvoiceEmail(@Body() sendInvoiceDto: SendInvoiceDto) {
    const { email, cartId } = sendInvoiceDto;
    return this.emailService.sendInvoiceEmail(email, cartId);
  }
}
