import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCartDto {
  @IsString()
  @IsEnum(['pending', 'done', 'cancel'], {
    message: 'Status must be one of: pending, done, cancel',
  })
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
