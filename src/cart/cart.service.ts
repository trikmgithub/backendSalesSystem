import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart as CartModel } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartModel.name) private cartModel: Model<CartModel>,
    readonly userService: UsersService
  ) {}

  //----------------POST /cart
  //create new cart
  async createCart(createCartDto: CreateCartDto) {
    const newCart = await this.cartModel.create(createCartDto);

    if (newCart) {
      const update = await this.userService.updateUserCart(createCartDto.userId, newCart._id);
    }

    return newCart;
  }

  //---------------GET /cart

  //get all carts
  async getAllCarts() {
    return await this.cartModel.find()
  }

  //get carts is pending
  async getCartsPending() {
    return await this.cartModel.find({ status: 'pending' });
  }

  async getCartsByUserId(userId: string): Promise<CartModel[]> {
    return this.cartModel.find({ userId }).populate('items.itemId');
  }

  //---------------PATCH /cart
  async updateCart(cartId: string, updateData: any): Promise<CartModel | null> {
    return this.cartModel.findByIdAndUpdate(cartId, updateData, { new: true });
  }
}
