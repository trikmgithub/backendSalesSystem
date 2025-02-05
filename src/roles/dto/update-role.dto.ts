import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateRoleDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'Permissions không được để trống' })
  @IsMongoId({ each: true, message: 'Each permission là mongo object id' })
  @IsArray({ message: 'Permissions có định dạng là array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
