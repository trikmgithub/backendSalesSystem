import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";


export class CreateItemDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsNotEmpty({ message: 'Price không được để trống'})
    price: number;

    @IsNotEmpty({message: 'Description không được để trống'})
    description: string;

    @IsNotEmpty({ message: 'Brand id is not empty'})
    brand: mongoose.Schema.Types.ObjectId;
}
