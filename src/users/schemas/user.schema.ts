import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string

  @Prop()
  name: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
