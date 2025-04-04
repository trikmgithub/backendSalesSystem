import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CartItemDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'Item ID is required' })
  itemId: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;
}

export class CreateCartDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @IsNotEmpty({ message: 'Cart items are required' })
  items: CartItemDto[];

  @IsNumber()
  @Min(0, { message: 'Total amount cannot be negative' })
  totalAmount: number;

  @IsString()
  @IsEnum(['pending', 'done', 'cancel'], {
    message: 'Status must be one of: pending, done, cancel',
  })
  @IsOptional()
  status?: string = 'pending';

  @IsString()
  @IsNotEmpty({ message: 'Payment method is required' })
  paymentMethod: string;
}
