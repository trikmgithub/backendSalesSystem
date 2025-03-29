import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart as CartModel } from './schemas/cart.schema';
import mongoose, { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { User as UserModel } from 'src/users/schemas/user.schema';
import { Item as ItemModel } from 'src/items/schemas/item.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartModel.name) private cartModel: Model<CartModel>,
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    @InjectModel(ItemModel.name) private itemModel: Model<ItemModel>,
    readonly userService: UsersService,
  ) {}

  //----------------POST /cart
  //create new cart
  async createCart(createCartDto: CreateCartDto) {
    const newCart = await this.cartModel.create(createCartDto);

    if (newCart) {
      const update = await this.userService.updateUserCart(
        createCartDto.userId,
        newCart._id,
      );
    }

    return newCart;
  }

  //---------------GET /cart

  //get all carts
  async getAllCarts() {
    return await this.cartModel.find();
  }

  //get carts is pending
  async getCartsPending() {
    return await this.cartModel.find({ status: 'pending' });
  }

  //get carts is done
  async getCartsDone() {
    return await this.cartModel.find({ status: 'done' });
  }

  //get carts is done
  async getCartsCancel() {
    return await this.cartModel.find({ status: 'cancel' });
  }

  async getCartsByUserId(userId: string): Promise<CartModel[]> {
    return this.cartModel.find({ userId }).populate('items.itemId');
  }

  async getCartById(cartId: string) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new BadRequestException('Invalid cart ID');
    }

    const cartInfo = await this.cartModel.findById(cartId);

    if (!cartInfo) {
      throw new BadRequestException('Cart not found');
    }

    const user = await this.userModel.findById(cartInfo.userId);

    const formattedItems = [];
    for (const item of cartInfo.items) {
      const itemDetails = await this.itemModel.findById(item.itemId);
      formattedItems.push({
        itemId: item.itemId,
        itemName: itemDetails ? itemDetails.name : 'Unknown Item',
        quantity: item.quantity,
        price: item.price,
      });
    }

    return {
      _id: cartInfo._id,
      userId: cartInfo.userId,
      username: user ? user.email : 'Unknown User',
      items: formattedItems,
      totalAmount: cartInfo.totalAmount,
      status: cartInfo.status || 'pending',
      paymentMethod: cartInfo.paymentMethod || 'Not specified',
      purchaseDate: cartInfo.purchaseDate,
    };
  }

  async generatePdf(res: Response, cartId: string) {
    const doc = new PDFDocument();

    // Thiết lập header response để tải xuống file PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

    // Gửi nội dung PDF đến response
    doc.pipe(res);
    const cartInfo = await this.getCartById(cartId);

    // Add title and header
    doc.fontSize(25).text('SKIN BEAUTY INVOICE', { align: 'center' });
    doc.moveDown();

    // Add order information
    doc.fontSize(14).text('Order Information', { underline: true });
    doc.fontSize(12).text(`Order ID: ${cartInfo._id}`);
    doc.text(`Customer gmail: ${cartInfo.username}`);
    doc.text(`Order Date: ${new Date(cartInfo.purchaseDate).toLocaleString()}`);
    doc.text(`Payment Method: ${cartInfo.paymentMethod}`);
    doc.moveDown();

    // Add items table
    doc.fontSize(14).text('Ordered Items', { underline: true });
    doc.moveDown(0.5);

    // Create table headers
    let y = doc.y;
    doc.fontSize(10);
    doc.text('Item name', 50, y);
    doc.text('Quantity', 250, y);
    doc.text('Price', 350, y);
    doc.text('Total', 450, y);

    doc
      .moveTo(50, doc.y + 5)
      .lineTo(550, doc.y + 5)
      .stroke();
    doc.moveDown();

    // Add items to table
    let itemTotal = 0;
    cartInfo.items.forEach((item, index) => {
      y = doc.y;
      doc.text(item.itemName.toString(), 50, y);
      doc.text(item.quantity.toString(), 250, y);
      doc.text(`${item.price.toFixed(2)} vnd`, 350, y);
      const total = item.quantity * item.price;
      itemTotal += total;
      doc.text(`${total.toFixed(2)} vnd`, 450, y);
      doc.moveDown();
    });

    // Add total line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Total Amount: ${cartInfo.totalAmount.toFixed(2)} vnd`, 300, doc.y);

    // Add footer
    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your purchase!', { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, {
      align: 'center',
    });

    // Kết thúc và gửi dữ liệu
    doc.end();
  }

  //---------------PATCH /cart
  async updateCart(cartId: string, updateData: any): Promise<CartModel | null> {
    return this.cartModel.findByIdAndUpdate(cartId, updateData, { new: true });
  }
}
