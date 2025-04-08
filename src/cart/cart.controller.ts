import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { PlaceOrderForOtherDto } from './dto/place-order-for-other.dto';
import { IUser } from 'src/users/interface/users.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //------------POST /cart

  //create new cart
  @Post('/create')
  @ResponseMessage('Cart created successfully')
  async createCart(@Body() createCartDto: PlaceOrderForOtherDto, @User() user: IUser) {
    try {
      const cart = await this.cartService.createCart(createCartDto, user);
      return cart;
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          success: false,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Place an order for someone else
  @ResponseMessage('Đặt hàng hộ người khác thành công')
  @Post('/create-for-other')
  async createCartForOther(
    @Body() placeOrderDto: PlaceOrderForOtherDto,
    @User() user: IUser,
  ) {
    try {
      const cart = await this.cartService.createCartForOther(
        placeOrderDto,
        user,
      );
      return {
        success: true,
        data: cart,
        message: 'Đặt hàng hộ người khác thành công',
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          success: false,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  //get all carts is cancel
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

  // Update cart status
  @Patch(':cartId')
  @ResponseMessage('Cart status updated successfully')
  async updateCartStatus(
    @Param('cartId') cartId: string,
    @Body() updateData: any,
  ) {
    try {
      const updatedCart = await this.cartService.updateCart(cartId, updateData);
      return {
        success: true,
        cart: updatedCart,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          success: false,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
