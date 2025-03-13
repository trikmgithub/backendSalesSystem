import { IsEnum } from "class-validator";

export class CreateCartDto {
    userId: string;

    items: [];

    totalAmount: number;

    @IsEnum(['pending', 'completed', 'canceled'])
    status: string;

    paymentMethod: string;
}
