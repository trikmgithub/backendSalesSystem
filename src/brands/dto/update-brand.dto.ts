import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateBrandDto {
  @IsNotEmpty({ message: 'Name khong duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Description khong duoc de trong' })
  description: string;
}
