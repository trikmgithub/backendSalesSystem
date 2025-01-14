import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Age không được để trống' })
  age: number;

  @IsNotEmpty({ message: 'Gender không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Address không được để trống' })
  role: string;

  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;

  isDeleted: boolean;
}
