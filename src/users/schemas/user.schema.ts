import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  // @Prop()
  // _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  role: string;

  @Prop()
  address: string;

  @Prop()
  refreshToken: string;

  @Prop()
  accessToken: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
  };

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
