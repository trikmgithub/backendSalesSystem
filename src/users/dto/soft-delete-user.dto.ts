import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

//PickType is a utility function that creates a new DTO class by inheriting 
//only the properties of the base DTO class that are specified in the generic argument.
export class SoftDeleteUserDto extends PickType(CreateUserDto, ['isDeleted'] as const) {
  deletedAt: Date;
}
