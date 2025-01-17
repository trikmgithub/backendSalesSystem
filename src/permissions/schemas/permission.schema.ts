import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Permission {
  @Prop()
  name: string;

  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
