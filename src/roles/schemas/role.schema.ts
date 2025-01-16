import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Permission } from "src/permissions/schemas/permission.schema";

@Schema({ timestamps: true})
export class Role {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    isActive: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Permission.name})
    permissions: Permission[];

}
