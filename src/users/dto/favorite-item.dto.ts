import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class FavoriteItemDto {
  @IsNotEmpty({ message: 'Item ID is required' })
  @IsMongoId()
  itemId: mongoose.Schema.Types.ObjectId;
} 