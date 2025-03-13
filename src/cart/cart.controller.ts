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
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //------------POST /cart

  //create new cart
  @ApiExcludeEndpoint()
  @Post('/create/')
  async createCart(@Body() createCartDto: CreateCartDto) {
    const cart = await this.cartService.createCart(createCartDto);

    return cart;
  }

  //------------GET /cart

  //get all cart
  @Get('all')
  async getAllCarts() {
    return await this.cartService.getAllCarts();
  }

  //get all carts is pending
  @Get('pending')
  async getCartsPending() {
    return await this.cartService.getCartsPending();
  }

  //get cart
  @Get('user/:userId')
  async getUserCarts(@Param('userId') userId: string) {
    return await this.cartService.getCartsByUserId(userId);
  }


  //-----------PATCH /cart
  @Patch(':cartId')
  async updateCartStatus(
    @Param('cartId') cartId: string,
    @Body() updateData: any,
  ) {
    return this.cartService.updateCart(cartId, updateData);
  }
}
