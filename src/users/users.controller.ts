import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteUserDto } from './dto/soft-delete-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //create user
  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //login
  @Get()
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.usersService.login(email, password);
  }

  //find one user by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //update user
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  //remove user by id
  @Patch(':id')
  remove(@Param('id') id: string ,@Body() softDeleteUserDto: SoftDeleteUserDto) {
    return this.usersService.remove(id, softDeleteUserDto);
  }
 
}
