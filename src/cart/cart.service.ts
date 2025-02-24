import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart as CartModel } from './schemas/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartModel.name) private cartModel: Model<CartModel>,
  ) {}
  
  //----------------POST /cart
  //create new cart
  async createCart(createCartDto: CreateCartDto) {
    const newCart = await this.cartModel.create(createCartDto);

    return newCart;
  }

  async getCartsByUserId(userId: string): Promise<CartModel[]> {
    return this.cartModel.find({ userId }).populate('items.itemId');
  }

  async updateCart(cartId: string, updateData: any): Promise<CartModel | null> {
    return this.cartModel.findByIdAndUpdate(cartId, updateData, { new: true });
  }
}
