import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Brand } from 'src/brands/shemas/brand.schema';

@Schema({ timestamps: true })
export class Item {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
  brand: mongoose.Schema.Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop()
  stock: boolean;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
