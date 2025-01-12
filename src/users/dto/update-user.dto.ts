import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

//OmitType is a utility function that creates a new DTO class by inheriting all properties of the base DTO class except the properties specified in the generic argument.
export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  _id: string;
}
