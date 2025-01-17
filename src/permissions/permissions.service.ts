import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission as PermissionModel } from './schemas/permission.schema';
import mongoose, { Model } from 'mongoose';
import { PaginationPermissionDto } from './dto/pagination-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(PermissionModel.name)
    private permissionModel: Model<PermissionModel>,
  ) {}

  //---------------POST /permissions

  //create a new permission
  async createNewPermission(createPermissionDto: CreatePermissionDto) {
    const { name, apiPath, method, module } = createPermissionDto;

    const isExist = await this.permissionModel.findOne({ apiPath, method });

    if (isExist) {
      throw new BadRequestException(
        `Permission apiPath=${apiPath} and method=${method} da ton tai`,
      );
    }

    const newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
    });

    return {
      newPermission,
    };
  }

  //---------------GET /permissions

  //get all permission with paginator
  async getAllPermission(paginationPermissionDto: PaginationPermissionDto) {
    const page = paginationPermissionDto.page ?? 1;
    const limit = paginationPermissionDto.limit ?? 10;

    const skip = (page - 1) * limit;

    const permissions = await this.permissionModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.permissionModel.countDocuments();

    return {
      meta: {
        currentPage: page,
        sizePage: limit,
        numberPermissions: total,
        totalPages: Math.ceil(total / limit),
      },
      result: permissions,
    };
  }

  //get one permission by id
  async getPermission(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Khong tim thay permission');
    }

    const permission = await this.permissionModel.findById({ _id: id });

    return permission;
  }

  //---------------PATCH /permissions

  //update one permission by id
  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    const { name, apiPath, method, module } = updatePermissionDto;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id permission is not valid');
    }

    const isExist = await this.permissionModel.findById({ _id: id });

    if (!isExist) {
      throw new BadRequestException('Id permission is not existed');
    }

    const updatePermission = await this.permissionModel.updateOne(
      { _id: id },
      { name, apiPath, method, module },
    );

    return updatePermission;
  }

  //soft delete one permission by id
  async softDeletePermission(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is invalid');
    }

    const isExist = this.permissionModel.findById({ _id: id });

    if (!isExist) {
      throw new BadRequestException('Id is not exist');
    }

    const permissionDeleted = this.permissionModel.updateOne(
      { _id: id },
      { isDeleted: true, deletedAt: new Date() },
    );

    return permissionDeleted;
  }

  //---------------Delete /permissions
  //delete permanently a permission by id
  async deletePermission(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid');
    }

    const isExist = this.permissionModel.findById({ _id: id });

    if (!isExist) {
      throw new BadRequestException('Id is not existed');
    }

    const deletePermission = this.permissionModel.deleteOne({ _id: id });

    return deletePermission;
  }
}
