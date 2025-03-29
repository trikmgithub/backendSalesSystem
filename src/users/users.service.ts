import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel } from './schemas/user.schema';
import { Role as RoleModel } from 'src/roles/schemas/role.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IUser } from './interface/users.interface';
import { User } from 'src/decorator/customize';
import { RegisterUserDto } from './dto/register-user.dto';
import { PaginationDto } from './dto/pagination-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    @InjectModel(RoleModel.name) private roleModel: Model<RoleModel>,
    private readonly configService: ConfigService,
  ) {}

  //------------------------CONSTANTS
  static readonly ROLE_USER = 'user';

  //------------------------POST /users

  //register a new user
  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, name, dateOfBirth, gender, address } =
      registerUserDto;

    const role = UsersService.ROLE_USER;

    const isExist = await this.userModel.findOne({ email });

    if (isExist) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại trong hệ thống.`,
      );
    }

    if (gender.toLowerCase() !== 'male' && gender.toLowerCase() !== 'female') {
      throw new BadRequestException('Gender phải là male hoặc female');
    }

    const roleObj = await this.roleModel.findOne({ name: role.toUpperCase() });

    const roleId = roleObj._id;

    const hashPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      dateOfBirth,
      gender: gender.toUpperCase(),
      address,
      roleId,
    });

    return newUser;
  }

  //create a new user by admin or manager or staff
  async createNewUser(createUserDto: CreateUserDto, @User() user: IUser) {
    const { email, password, name, dateOfBirth, gender, address, role } =
      createUserDto;

    const isExist = await this.userModel.findOne({ email });

    if (isExist) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại trong hệ thống.`,
      );
    }

    if (gender.toLowerCase() !== 'male' && gender.toLowerCase() !== 'female') {
      throw new BadRequestException('Gender phải là male hoặc female');
    }
    const roleObj = await this.roleModel.findOne({ name: role.toUpperCase() });

    const roleId = roleObj._id;

    const hashPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      dateOfBirth,
      gender: gender.toUpperCase(),
      address,
      roleId: roleId,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return newUser;
  }

  //save google user
  async createGoogleUser(googleUserInfo: any) {
    const role = this.configService.get<string>('DEFAULT_ROLE');
    const roleObj = await this.roleModel.findOne({ name: role.toUpperCase() });
    const roleId = roleObj._id;

    let user = await this.userModel.create({
      email: googleUserInfo.email,
      name: googleUserInfo.name,
      avatar: googleUserInfo.avatar,
      roleId,
    });

    return user;
  }

  //type of skin user
  async skin(type: string, user: IUser) {
    const updated = await this.userModel.updateOne(
      { _id: user._id },
      {
        skin: type,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return updated;
  }

  //-------------------------------------GET /users

  //get one user with id
  async getOneUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const userInfo = await this.userModel
      .findOne({ _id: id })
      .select('-password');

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

  //get cart by user id
  async getCartByUserId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id user is not valid');
    }

    const userInfo = await this.userModel.findById(id);

    if (!userInfo) {
      throw new BadRequestException('Id user is not existed');
    }

    const cartInfo = await this.userModel.findById(id).populate('carts');

    return {
      userId: cartInfo._id,
      userEmail: cartInfo.email,
      userName: cartInfo.name,
      userCarts: cartInfo.carts,
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

  //update user address
  async updateAddress(
    updateUserAddress: { email: string; address: string },
    user: IUser,
  ) {
    const { email, address } = updateUserAddress;

    const isExisted = await this.userModel.findOne({ email });

    if (!isExisted) {
      throw new BadRequestException('User không tồn tại');
    }

    const updatedUser = await this.userModel.updateOne(
      { email },
      {
        address,
        updatedAt: new Date(),
        updatedBy: {
          _id: user?._id,
          email: user?.email,
        },
      },
    );

    return updatedUser;
  }

  //forget password
  async forgetPassword(email: string, password: string, recheck: string) {
    const isExisted = await this.findOneByEmail(email);

    let hashNewPassword = null;

    if (!isExisted) {
      throw new BadRequestException(
        'Invalid user email/ this email is not register',
      );
    }

    if (!isExisted.password) {
      throw new BadRequestException('You login by Google!');
    }

    if (password != recheck) {
      throw new BadRequestException(
        'Password and Confirm password again is not same',
      );
    }

    if (password) {
      hashNewPassword = this.getHashPassword(password);
    }

    const updatePassword = await this.userModel.updateOne(
      { email },
      { password: hashNewPassword },
    );

    return updatePassword;
  }

  //update user password
  async updatePassword(
    updateUserPassword: {
      email: string;
      password: string;
      newPassword: string;
    },
    user: IUser,
  ) {
    const { email, password, newPassword } = updateUserPassword;

    const isExisted = await this.userModel.findOne({ email });

    let hashNewPassword = null;

    if (!isExisted) {
      throw new BadRequestException('Invalid user email');
    }

    if (!isExisted.password) {
      throw new BadRequestException('You login by Google!');
    }

    const isCorrectPass = this.isValidPassword(password, isExisted.password);

    if (isCorrectPass) {
      hashNewPassword = this.getHashPassword(newPassword);
    } else {
      throw new BadRequestException('Old password is not correct!');
    }

    const updateUser = await this.userModel.updateOne(
      { email },
      {
        password: hashNewPassword,
        updatedAt: new Date(),
        updatedBy: {
          _id: user?._id,
          email: user?.email,
        },
      },
    );

    return updateUser;
  }

  //update user cart
  async updateUserCart(userId: any, cartId: any) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new BadRequestException('Cart id is not existed');
    }

    const userInfo = await this.userModel.findById(userId);

    if (!userInfo) {
      throw new BadRequestException('User id is not existed');
    }

    // Cập nhật user với cartId mới (push vào mảng carts)
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { carts: cartId } }, // Đảm bảo không bị trùng lặp
      { new: true, runValidators: true },
    );

    return updatedUser;
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

  //---------------------------Other functions

  async findOneByEmail(username: string) {
    const user = this.userModel.findOne({ email: username });
    return user;
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  //get user by refreshtoken
  async findUserByToken(refreshToken: string) {
    const data = await this.userModel
      .findOne({ refreshToken })
      .select('-password');

    return data;
  }

  //update token
  updateUserToken = async (refreshToken: string, _id: string) => {
    const update = await this.userModel.updateOne({ _id }, { refreshToken });
    return update;
  };

  //hash password
  getHashPassword = (password: string) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };
}
