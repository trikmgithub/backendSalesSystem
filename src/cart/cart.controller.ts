import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';

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

  //get all carts is done
  @Get('done')
  async getCartsDone() {
    return await this.cartService.getCartsDone();
  }

  //get all carts is done
  @Get('cancel')
  async getCartsCancel() {
    return await this.cartService.getCartsCancel();
  }

  //Export check cartId
  @Get('download/:cartId')
  generatePdf(@Res() res: Response, @Param('cartId') cartId: string) {
    return this.cartService.generatePdf(res, cartId);
  }

  //get cart
  @Get('user/:userId')
  async getUserCarts(@Param('userId') userId: string) {
    return await this.cartService.getCartsByUserId(userId);
  }

  //get cart by id
  @Get('info/:cartId')
  async getCartById(@Param('cartId') cartId: string) {
    return await this.cartService.getCartById(cartId);
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
