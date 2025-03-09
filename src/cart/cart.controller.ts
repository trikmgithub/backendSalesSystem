import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //------------POST /cart

  //create new cart
  @Post('/create')
  async createCart(@Body() createCartDto: CreateCartDto) {
    const cart = await this.cartService.createCart(createCartDto);

    return cart;
  }

  @Get('user/:userId')
  async getUserCarts(@Param('userId') userId: string) {
    return this.cartService.getCartsByUserId(userId);
  }

  @Patch(':cartId')
  async updateCartStatus(
    @Param('cartId') cartId: string,
    @Body() updateData: any,
  ) {
    return this.cartService.updateCart(cartId, updateData);
  }
}
