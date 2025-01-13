import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async validateGoogleUser(details: any) {
    console.log('AuthService');
    console.log(details);
    const user = await this.usersService.findOneByUsername(details.email);
    console.log(user);
    if (user) return user;
    console.log('User not found. Creating...');
    const newUser = this.usersService.createGoogleUser(details);
    return newUser;
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
