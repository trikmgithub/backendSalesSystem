import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Item } from 'src/items/schemas/item.schema';

@Schema({ timestamps: true })
export class Brand {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
