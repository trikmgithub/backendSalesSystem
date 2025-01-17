import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role as RoleModel } from './schemas/role.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleModel.name)
    private roleModel: Model<RoleModel>,
  ) {}

  //---------------------POST /roles

  //create new role
  async createRole(createRoleDto: CreateRoleDto) {
    const { name, description, permissions } = createRoleDto;

    const isExist = await this.roleModel.findOne({ name });

    if (isExist) {
      throw new BadRequestException(`Role is existed`);
    }

    // if (!Array.isArray(permissions)) {
    //     throw new BadRequestException('Permissions must be an array.');
    // }

    if (!permissions.every((id) => mongoose.isValidObjectId(id))) {
      throw new BadRequestException(
        'One or more permissions are not valid ObjectId.',
      );
    }

    const newRole = await this.roleModel.create({
      name: name.toUpperCase(),
      description,
      permissions,
    });
    return newRole;
  }

  //---------------------GET /roles
  //---------------------PATCH /roles
  //---------------------DELETE /roles
}
