import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateBrandDto {
  @IsNotEmpty({ message: 'Name khong duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Description khong duoc de trong' })
  description: string;

  @IsNotEmpty({message: 'Items is not empty'})
  @IsMongoId({each: true, message: 'Must be Mongo object id'})
  @IsArray({message: 'Items must be array format'})
  items: mongoose.Schema.Types.ObjectId[];
}
