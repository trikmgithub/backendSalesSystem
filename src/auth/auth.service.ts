import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/interface/users.interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async createGoogleUser(details: any) {
    const user = await this.usersService.findOneByEmail(details.email);

    if (user?.password) {
      throw new BadRequestException('Email nay da co trong he thong hay login bang email va password')
    }

    if (user) {
      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        access_token: details.accessToken
      };
    }
      
    const newUser = await this.usersService.createGoogleUser(details);
    return {
      _id: user._id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      access_token: details.accessToken,
    };
  }

  //---------------------------------Login
  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    await this.usersService.updateUserToken(refresh_token, _id);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: false,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
  }

  //----------------------------------Logout
  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');

    return 'ok';
  };

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email, roleId } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          roleId,
        };
        const refresh_token = this.createRefreshToken(payload);
        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());
        //set refresh_token as cookies
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            roleId,
          },
        };
      } else {
        throw new BadRequestException(
          `Refresh token không hợp lệ. Vui lòng login.`,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        `Refresh token không hợp lệ. Vui lòng login.`,
      );
    }
  };
}
