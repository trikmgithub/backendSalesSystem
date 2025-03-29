import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendInvoiceDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Cart ID không được để trống' })
  cartId: string;
}
