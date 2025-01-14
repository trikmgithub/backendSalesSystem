import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination-user.dto'; 
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './interface/users.interface';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //---------------POST /users

  //register a new user
  @Public()
  @ResponseMessage('Register success')
  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    let newUser = await this.usersService.registerNewUser(registerUserDto);
    console.log(newUser);
    return {
      newUser,
    };
  }

  //create a new user by admin or manager or staff
  @Post('/create')
  @ResponseMessage('Create user success')
  async createNewUser(
    @Body() createUserDto: CreateUserDto,
    @User() user: IUser,
  ) {
    let newUser = await this.usersService.createNewUser(createUserDto, user);
    return {
      newUser,
    };
  }

  //------------------------GET /users

  //get one user by id
  @Get('/info/:id')
  @ResponseMessage('Get one user by id successfully')
  async getOneUser(@Param('id') id: string ) {
    const userInfo = await this.usersService.getOneUsers(id);
    return {
      userInfo,
    }
  }

  //get all users with pagination
  @Get('/all')
  @ResponseMessage('Get all users with pagination successfully')
  async getAllUsers(@Query() paginationDto: PaginationDto) {
    const paginateUser = await this.usersService.getAllUsers(paginationDto);
    return {
      paginateUser,
    }
  }

  //find one user by id
  
  //------------------------PATCH /users

  //update one user
  @Patch('/update')
  async updateOneUser(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updateUser = await this.usersService.updateOneUser(updateUserDto, user);
    return {
      updateUser,
    };
  }

  //soft delete a user
  @Patch('/delete/:id')
  @ResponseMessage('Soft delete user success')
  async softDeleteOneUser(
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    const deleteUser = await this.usersService.softDeleteOneUser(id, user);
    return {
      deleteUser,
    }
  }
 

  //-----------------------------DELETE /users

  //delete a user
  @Delete('/delete/:id')
  @ResponseMessage('Delete user success')
  async deleteOneUser(@Param('id') id: string) {
    const deleteUser = await this.usersService.deleteOneUser(id);
    return {
      deleteUser,
    };
  }
}
