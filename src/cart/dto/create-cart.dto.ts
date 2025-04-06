import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty({ message: 'UserId không được để trống' })
  userId: string;

  @IsNotEmpty({ message: 'Items không được để trống' })
  items: {
    itemId: string;
    quantity: number;
    price: number;
  }[];

  @IsNotEmpty({ message: 'Total amount không được để trống' })
  totalAmount: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty({ message: 'Payment method không được để trống' })
  paymentMethod: string;

  @IsString()
  @IsOptional()
  orderNote?: string;
}
