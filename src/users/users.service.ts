import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SoftDeleteUserDto } from './dto/soft-delete-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //hash password
  getHashPassword = (password: string) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };

  //create user
  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);

    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
    });

    return user;
  }

  //login
  async login(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('password')
      .exec();

    if (!user) {
      console.log('User not found');
      return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password does not match');
    }

    return isMatch;
  }

  //find one user by id
  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found user`;
    return this.userModel.findOne({
      _id: id,
    });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  //update user
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  //delete user

  async remove(id: string, softDeleteUserDto: SoftDeleteUserDto) {

    // Kiểm tra xem _id có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }

    // Thực hiện tìm kiếm và cập nhật người dùng
    const result = await this.userModel.findOneAndUpdate(
      { _id: id },
      { isDeleted: true, deletedAt : new Date() },
      { new: true }, // Trả về tài liệu đã cập nhật
    );

    // Xử lý khi không tìm thấy người dùng
    if (!result) {
      throw new Error('User not found');
    }

    // Trả về kết quả
    return {
      message: 'User soft deleted successfully',
      data: result,
    };
  }
}
