import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  //---------------------POST /roles

  //create new role
  @ResponseMessage('Create role successfully')
  @Post('/create')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const newRole = await this.rolesService.createRole(createRoleDto);

    return { newRole };
  }
  //---------------------GET /roles
  //---------------------PATCH /roles
  //---------------------DELETE /roles
}
