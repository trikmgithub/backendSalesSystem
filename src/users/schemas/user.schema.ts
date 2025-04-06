import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Cart } from 'src/cart/schemas/cart.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { Item } from 'src/items/schemas/item.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  gender: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
  })
  roleId: mongoose.Schema.Types.ObjectId;

  @Prop()
  address: string;

  @Prop()
  skin: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Cart.name }],
    default: [],
  })
  carts: mongoose.Schema.Types.ObjectId[];

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Item.name }],
    default: [],
  })
  favoriteItems: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
