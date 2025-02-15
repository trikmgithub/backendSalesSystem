import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

// Load các biến môi trường từ file .env
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // Lấy từ biến môi trường
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Lấy từ biến môi trường
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // URL callback
      scope: ['email', 'profile'], // Quyền truy cập
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Trích xuất thông tin từ profile trả về bởi Google
    const { name, emails, photos } = profile;

    const user = {
      email: emails?.[0]?.value || null, // Đảm bảo an toàn khi không có email
      firstName: name?.givenName || null,
      lastName: name?.familyName || null,
      picture: photos?.[0]?.value || null,
      accessToken,
      refreshToken,
    };

    // Xử lý xong thì gọi hàm done để tiếp tục luồng xử lý của Passport
    done(null, user);
  }
}
