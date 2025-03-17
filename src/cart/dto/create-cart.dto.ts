import { IsEnum } from "class-validator";

export class CreateCartDto {
    userId: string;

    items: [];

    totalAmount: number;

    status: string;

    paymentMethod: string;
}
