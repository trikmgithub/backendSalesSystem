import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { PaginationPermissionDto } from './dto/pagination-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  //---------------POST /permissions

  //create a new permission
  @ResponseMessage('Create new permission successfully')
  @Post('/create')
  async createNewPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const newPermission = await this.permissionsService.createNewPermission(
      createPermissionDto,
    );

    return {
      newPermission,
    };
  }

  //---------------GET /permissions

  //get all permission with paginator
  @ResponseMessage('Get all permissions')
  @Get('/all')
  async getAllPermission(
    @Body() paginationPermissionDto: PaginationPermissionDto,
  ) {
    const permissions = await this.permissionsService.getAllPermission(
      paginationPermissionDto,
    );

    return { permissions };
  }

  //get one permission by id
  @ResponseMessage('Get permission successfully')
  @Get(':id')
  async getPermission(@Param('id') id: string) {
    const permission = await this.permissionsService.getPermission(id);

    return { permission };
  }
  //---------------PATCH /permissions
  //update one permission by id
  @ResponseMessage('Update permission successfully')
  @Patch(':id')
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const updatePermission = await this.permissionsService.updatePermission(
      id,
      updatePermissionDto,
    );
    return { updatePermission };
  }

  //soft delete one permission by id
  @ResponseMessage('Soft delete permission successfully')
  @Patch('delete/:id')
  async softDeletePermission(@Param('id') id: string) {
    const permissionDeleted =
      await this.permissionsService.softDeletePermission(id);

    return { permissionDeleted };
  }

  //---------------Delete /permissions

  //delete permanently a permission by id
  @ResponseMessage('Deleted a permission successfully')
  @Delete(':id')
  async deletePermission(@Param('id') id: string) {
    const deletePermission = await this.permissionsService.deletePermission(id);

    return { deletePermission };
  }
}
