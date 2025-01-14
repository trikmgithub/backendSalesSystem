import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  gender: string;

  role: string;

  @IsNotEmpty()
  address: string;

  isDeleted: boolean;
}
