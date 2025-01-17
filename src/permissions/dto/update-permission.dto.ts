import { IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto {
  @IsNotEmpty({ message: 'Name khong duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'path khong duoc de trong' })
  apiPath: string;

  @IsNotEmpty({ message: 'Method khong duoc de trong' })
  method: string;

  @IsNotEmpty({ message: 'Module khong duoc de trong' })
  module: string;
}
