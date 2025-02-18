import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import mongoose from 'mongoose';
import { isFloat64Array } from 'util/types';

export class CreateItemDto {
  @IsNotEmpty({ message: 'Name is not empty' })
  name: string;

  @IsNotEmpty({ message: 'Price is not empty' })
  @Transform(({ value }) => parseFloat(value))
  @Min(0, { message: 'Price must not be less than 0' })
  price: number;

  @IsNotEmpty({ message: 'Description is not empty' })
  description: string;

  @IsNotEmpty({ message: 'Brand id is not empty' })
  brand: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Quantity is not empty' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Quantity must be an integer number' })
  @Min(1, { message: 'Quantity must not be less than 1' })
  quantity: number;

  flashSale: boolean
}
