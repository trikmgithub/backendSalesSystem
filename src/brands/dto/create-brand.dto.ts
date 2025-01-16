import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateBrandDto {
    @IsNotEmpty({message: 'Name khong duoc de trong'})
    name: string;

    @IsNotEmpty({ message: 'Description khong duoc de trong'})
    description: string;

    @IsNotEmpty({message: 'Items khong duoc de trong'})
    items: mongoose.Schema.Types.ObjectId[];
}
