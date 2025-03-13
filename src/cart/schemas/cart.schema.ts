import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/decorator/customize';
import { Item } from 'src/items/schemas/item.schema';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop([
    {
      itemId: { type: MongooseSchema.Types.ObjectId, ref: Item.name },
      quantity: { type: Number },
      price: { type: Number },
    },
  ])
  items: {
    itemId: MongooseSchema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop()
  status: string;

  @Prop()
  paymentMethod: string;

  @Prop({ default: Date.now })
  purchaseDate: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
