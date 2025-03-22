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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './interface/users.interface';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('Users Module')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //---------------POST /users

  //register a new user
  @Public()
  @ResponseMessage('Register success')
  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    let user = await this.usersService.registerUser(registerUserDto);

    return user;
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

  // forget password
  @Public()
  @Post('forget-password')
  async forgetPassword(
    @Body('email') email: string, 
    @Body('password') password: string, 
    @Body('recheck') recheck: string
  ) {
    return await this.usersService.forgetPassword(email, password, recheck)
  }

  //------------------------GET /users

  //get one user by id
  @Get('/info/:id')
  @ResponseMessage('Get one user by id successfully')
  async getOneUser(@Param('id') id: string) {
    const userInfo = await this.usersService.getOneUser(id);
    return userInfo;
  }

  //get all users with pagination
  @Get('/all')
  @ResponseMessage('Get all users with pagination successfully')
  async getAllUsers(@Query() paginationDto: PaginationDto) {
    const paginateUser = await this.usersService.getAllUsers(paginationDto);
    return paginateUser;
  }

  //get cart
  @Get('/cart/:id')
  @ResponseMessage('Get cart user by id user successfully')
  async getCartByUserId(@Param('id') id: string) {
    const carts = await this.usersService.getCartByUserId(id);
    return carts;
  }

  //------------------------PATCH /users

  
  //type of skin user 
  @Patch('/skin/:type')
  async skin(
    @Param('type') type: string,
    @User() user: IUser
  ) {
    return await this.usersService.skin(type, user)
  }

  //update one user
  @Patch('/update')
  async updateOneUser(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    const updateUser = await this.usersService.updateOneUser(
      updateUserDto,
      user,
    );
    return updateUser;
  }

  //soft delete a user
  @Patch('/delete/:id')
  @ResponseMessage('Soft delete user success')
  async softDeleteOneUser(@Param('id') id: string, @User() user: IUser) {
    const deleteUser = await this.usersService.softDeleteOneUser(id, user);
    return deleteUser;
  }

  //update user address
  @Patch('/address')
  @ResponseMessage('Update user address success')
  async updateAddress(
    @Body() updateUserAddress: { email: string; address: string },
    @User() user: IUser,
  ) {
    const updateUser = await this.usersService.updateAddress(
      updateUserAddress,
      user,
    );
    return updateUser;
  }

  //update user password
  @Patch('/password')
  @ResponseMessage('Update user password success')
  async updatePassword(
    @Body()
    updateUserPassword: {
      email: string;
      password: string;
      newPassword: string;
    },
    @User() user: IUser,
  ) {
    const updateUser = await this.usersService.updatePassword(
      updateUserPassword,
      user,
    );
    return updateUser;
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
