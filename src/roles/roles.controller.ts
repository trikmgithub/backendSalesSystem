import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { PaginationDto } from './dto/pagination-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  //---------------------POST /roles

  //create new role
  @Post('/create')
  @ResponseMessage('Create role successfully')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const newRole = await this.rolesService.createRole(createRoleDto);

    return newRole;
  }

  //---------------------GET /roles

  //get all roles
  @Get('/all')
  @ResponseMessage("Get all roles successfully")
  async getAllRoles() {
    const roles = await this.rolesService.getAllRoles();

    return roles;
  }

  //get roles with pagination
  @Get('/paginate')
  @ResponseMessage("Get roles with pagination successfully")
  async getRolesPagination(@Query() paginationDto: PaginationDto) {
    const roles = await this.rolesService.getRolesPagination(paginationDto);

    return roles;
  }

  //get one role
  @Get(':id')
  @ResponseMessage("Get one role successfully") 
  async getRole(@Param('id') id: string) {
    const role = await this.rolesService.getRole(id);

    return role;
  }

  //---------------------PATCH /roles

  //update one role
  @Patch(':id')
  @ResponseMessage("Update a role successfully")
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesService.updateOneRole(id, updateRoleDto);

    return role;
  }

  //soft delete one role
  @Patch('/hide/:id')
  @ResponseMessage("Soft delete a role successfully")
  async hideRole(@Param('id') id: string) {
    const role = await this.rolesService.hideOneRole(id);
    
    return role;
  }

  //---------------------DELETE /roles

  //delete one role
  @Delete(':id')
  @ResponseMessage("Delete a role successfully")
  async remove(@Param('id') id: string) {
    const role = await this.rolesService.remove(id);

    return role;
  }
}
