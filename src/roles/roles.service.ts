import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role as RoleModel } from './schemas/role.schema';
import mongoose, { Model } from 'mongoose';
import { PaginationDto } from './dto/pagination-role.dto';

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
      throw new BadRequestException(`Role ${name} is existed`);
    }

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

  //get one role
  async getRole(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id role is not valid');
    }

    const role = await this.roleModel.findById(id);

    return role;
  }

  //get all roles
  async getAllRoles() {
    const roles = await this.roleModel.find();

    return roles;
  }

  //get roles with pagination
  async getRolesPagination(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const skip = (page - 1) * limit;
    const roles = await this.roleModel.find().skip(skip).limit(limit).exec();
    const total = await this.roleModel.countDocuments();

    return {
      meta: {
        currentPage: page,
        sizePage: limit,
        numberRoles: total,
        totalPages: Math.ceil(total / limit),
      },
      roles,
    };
  }

  //---------------------PATCH /roles

  //update one role
  async updateOneRole(id: string, updateRoleDto: UpdateRoleDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id role is not valid');
    }

    const { name, description, permissions } = updateRoleDto;

    const role = await this.roleModel.updateOne(
      { _id: id },
      {
        name: name.toUpperCase(),
        description: description.charAt(0).toUpperCase() + description.slice(1),
        permissions,
      },
    );

    return role;
  }

  //soft delete one role
  async hideOneRole(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id role is not valid');
    }

    const role = await this.roleModel.updateOne(
      { _id: id },
      { isDeleted: true },
    );

    return role;
  }

  //---------------------DELETE /roles

  //delete one role
  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id role is not valid');
    }

    const role = await this.roleModel.deleteOne({ _id: id });

    return role;
  }

  //---------------------EXTERNAL

  //find role name by id
  async getNameRoleById(id: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id role is not valid');
    }
    const roleName = await this.roleModel.findById(id).select('name');
    if (!roleName) {
      throw new BadRequestException('Role Id is not existed');
    }
    return roleName;
  }
}
