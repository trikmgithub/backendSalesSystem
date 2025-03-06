export class CreatePayoDto {
    orderCode?: number;
    amount: number;
    description: string;
    items: PayoItem[];
    returnUrl: string;
    cancelUrl: string;
}

export class PayoItem {
    name: string;
    quantity: number;
    price: number;
}