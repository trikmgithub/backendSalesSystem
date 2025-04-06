import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { IsMongoId } from 'class-validator';

export class CartItemDto {
  @IsNotEmpty({ message: 'Item ID không được để trống' })
  @IsMongoId({ message: 'Item ID không hợp lệ' })
  itemId: string;

  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;

  @Min(0, { message: 'Giá tiền phải lớn hơn hoặc bằng 0' })
  price: number;
}

export class PlaceOrderForOtherDto {
  @IsNotEmpty({ message: 'Items không được để trống' })
  items: CartItemDto[];

  @IsNotEmpty({ message: 'Total amount không được để trống' })
  @Min(0, { message: 'Tổng tiền phải lớn hơn hoặc bằng 0' })
  totalAmount: number;

  @IsString()
  @IsNotEmpty({ message: 'Payment method không được để trống' })
  paymentMethod: string;

  // Recipient information
  @IsString()
  @IsNotEmpty({ message: 'Recipient name không được để trống' })
  recipientName: string;

  @IsEmail({}, { message: 'Recipient email không đúng định dạng' })
  @IsOptional()
  recipientEmail?: string;

  @IsString()
  @IsNotEmpty({ message: 'Recipient address không được để trống' })
  recipientAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Recipient phone không được để trống' })
  @Matches(/^[0-9]{10}$/, { message: 'Số điện thoại không hợp lệ' })
  recipientPhone: string;

  @IsString()
  @IsOptional()
  orderNote?: string;
}
