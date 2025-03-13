import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/interface/users.interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService,
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
      throw new BadRequestException(
        'Email này đã có trong hệ thống, hãy login bằng email và password',
      );
    }

    let userData;

    if (user) {
      const role = await this.rolesService.getRole(user.roleId.toString());
      userData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: role.name,
      };
    } else {
      const newUser = await this.usersService.createGoogleUser(details);
      const roleOfUser = await this.rolesService.getNameRoleById(
        newUser.roleId,
      );
      userData = {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        role: roleOfUser.name,
      };
    }

    // Tạo JWT payload
    const payload = {
      sub: userData._id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      iss: 'from server',
    };

    // Tạo access token
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<string>('JWT_ACCESS_EXPIRE')) / 1000,
    });

    // Tạo refresh token
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });

    // Lưu refresh token vào database
    await this.usersService.updateUserToken(refresh_token, userData._id);

    return {
      _id: userData._id,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      access_token: access_token,
      refresh_token: refresh_token,
      role: userData.role,
    };
  }

  //---------------------------------Login
  async login(user: IUser, response: Response) {
    try {
      const { _id, name, email, roleId } = user;

      let getRole = await this.rolesService.getRole(roleId.toString());

      const payload = {
        sub: 'token login',
        iss: 'from server',
        _id,
        name,
        email,
        role: getRole.name,
      };

      const refresh_token = this.createRefreshToken(payload);

      await this.usersService.updateUserToken(refresh_token, _id);

      response.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      });

      const getUser = await this.usersService.findOneByEmail(email);
      getRole = await this.rolesService.getRole(getUser.roleId.toString());

      const data = {
        access_token: this.jwtService.sign(payload),
        _id,
        name,
        email,
        role: getRole.name,
      };

      return data;
    } catch (error) {
      console.log('Error at auth.service/login: ', error);
    }
  }

  //----------------------------------Logout
  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');

    return 'ok';
  };

  //-----------------------------------Token

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
        const roleObject = await this.rolesService.getRole(roleId.toString());
        const role = roleObject.name;
        console.log('user', user);
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
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
            role,
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
