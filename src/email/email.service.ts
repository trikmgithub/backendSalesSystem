import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmailService {
  private otpStorage = new Map<string, string>(); // Lưu OTP tạm thời trong bộ nhớ RAM của server

  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}

  // Tạo mã OTP 6 chữ số
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Lưu OTP vào bộ nhớ tạm thời
  saveOTP(email: string, otp: string) {
    this.otpStorage.set(email, otp);
    setTimeout(() => this.otpStorage.delete(email), 5 * 60 * 1000); // Hết hạn sau 5 phút
  }

  // Gửi OTP qua email
  async sendOTP(email: string) {
    const isExisted = this.userService.findOneByEmail(email);

    if (isExisted) {
      throw new BadRequestException('Email is existed');
    }

    const otp = this.generateOTP();
    this.saveOTP(email, otp);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Beauty Skin OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
      });
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to send OTP', error };
    }
  }

  // Xác thực OTP
  verifyOTP(email: string, otp: string) {
    const storedOTP = this.otpStorage.get(email);
    if (storedOTP && storedOTP === otp) {
      this.otpStorage.delete(email);
      return { success: true, message: 'OTP verified' };
    }
    return { success: false, message: 'Invalid or expired OTP' };
  }
}
