import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

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
    const user = await this.userModel.findOne({ email })
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;
    return this.userModel.findOne({
      _id: id
    })
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }
  
  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }


  //update user
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }


  //delete user
  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;
    return this.userModel.deleteOne({
      _id: id
    })
  }

}
