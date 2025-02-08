import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel } from './schemas/user.schema';
import { Role as RoleModel } from 'src/roles/schemas/role.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser } from './interface/users.interface';
import { User } from 'src/decorator/customize';
import { RegisterUserDto } from './dto/register-user.dto';
import { PaginationDto } from './dto/pagination-user.dto';
import { Mode } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    @InjectModel(RoleModel.name) private roleModel: Model<RoleModel>,
  ) {}

  //------------------config
  //get user by refreshtoken
  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };

  //update token
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  //hash password
  getHashPassword = (password: string) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };

  //------------------------POST /users

  //register a new user
  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, name, age, gender, address } =
      registerUserDto;

    const role = 'CUSTOMER';

    const isExist = await this.userModel.findOne({ email });

    if (isExist) {
      throw new BadRequestException(
        `Email: ${email} is existed.`,
      );
    }

    if (gender.toLowerCase() !== 'male' && gender.toLowerCase() !== 'female') {
      throw new BadRequestException('Gender must be male or female');
    }

    const roleObj = await this.roleModel.findOne(
      {name: role}
    )

    console.log('Role >>>>>',roleObj._id)
    const roleId = roleObj._id;

    const hashPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      age,
      gender: gender.toUpperCase(),
      address,
      roleId
    });

    return newUser;
  }

  //create a new user by admin or manager or staff
  async createNewUser(createUserDto: CreateUserDto, @User() user: IUser) {
    const { email, password, name, age, gender, address, role } = createUserDto;

    const isExist = await this.userModel.findOne({ email });

    if (isExist) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại trong hệ thống.`,
      );
    }

    const hashPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      age,
      gender,
      address,
      role,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return newUser;
  }

  //save google user
  async createGoogleUser(googleUserInfo: any) {
    let user = await this.userModel.create({
      email: googleUserInfo.email,
      name: googleUserInfo.firstName + ' ' + googleUserInfo.lastName,
      accessToken: googleUserInfo.accessToken,
    });

    return user;
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  //-------------------------------------GET /users

  //get one user with id
  async getOneUsers(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const userInfo = (await this.userModel.findOne({ _id: id }).select("-password")).populate({path: "role", select: {_id: 1, name: 1}});
    return userInfo;
  }

  //get all users with pagination
  async getAllUsers(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;

    const skip = (page - 1) * limit;

    const users = await this.userModel.find().skip(skip).limit(limit).exec();
    const total = await this.userModel.countDocuments();

    return {
      meta: {
        currentPage: page,
        sizePage: limit,
        numberUsers: total,
        totalPages: Math.ceil(total / limit),
      },
      result: users,
    };
  }

  //-------------------------------------PATCH /users

  //update one user
  async updateOneUser(updateUserDto: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
        },
      },
    );

    return updated;
  }

  //soft delete a user
  async softDeleteOneUser(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const deleteUser = await this.userModel.updateOne(
      { _id: id },
      {
        isDeleted: true,
        deletedBy: {
          _id: user._id,
        },
        deletedAt: new Date(),
      },
    );

    return deleteUser;
  }

  //-----------------------------DELETE /users

  //delete a user
  async deleteOneUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const deleteUser = await this.userModel.deleteOne({ _id: id });

    return deleteUser;
  }
}
