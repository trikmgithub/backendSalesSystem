import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ timestamps: true})
export class Permission {
    @Prop()
    name: string;

    @Prop()
    path: string;

    @Prop()

    method: string;

    @Prop()

    description: string;
}
