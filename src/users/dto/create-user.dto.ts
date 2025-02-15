import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống.' })
  password: string;

  @IsNotEmpty({ message: 'Name không được để trống.' })
  name: string;

  @IsNotEmpty({ message: 'dateOfBirth không được để trống.' })
  dateOfBirth: Date;

  @IsNotEmpty({ message: 'Gender không được để trống.' })
  gender: string;

  @IsNotEmpty({ message: 'Role không được để trống.' })
  @IsMongoId({ message: 'Role có định dạng là mongo id.' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Address không được để trống.' })
  address: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc', description: 'username' })
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  readonly password: string;
}
