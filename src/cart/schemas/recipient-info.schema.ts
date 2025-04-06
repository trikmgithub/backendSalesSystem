import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipientInfoDocument = RecipientInfo & Document;

@Schema()
export class RecipientInfo {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  note: string;
}

export const RecipientInfoSchema = SchemaFactory.createForClass(RecipientInfo);
