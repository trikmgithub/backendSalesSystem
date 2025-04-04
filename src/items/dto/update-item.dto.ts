import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import mongoose from 'mongoose';

export class UpdateItemDto {
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

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'FlashSale must be a number' })
  @Min(0, { message: 'FlashSale percentage must not be less than 0' })
  @Max(100, { message: 'FlashSale percentage must not be greater than 100' })
  flashSale: number;
}
