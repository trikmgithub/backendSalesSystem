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
    const session = await this.cartModel.db.startSession();
    
    try {
      session.startTransaction();
      
      
      for (const item of createCartDto.items) {
        const itemDetails = await this.itemModel.findOneAndUpdate(
          { 
            _id: item.itemId, 
            quantity: { $gte: item.quantity } //gte: greater than or equal to
          },
          { 
            $inc: { quantity: -item.quantity }, //inc: increment
            $set: { stock: true } //set: set stock to true
          },
          { 
            new: true, //new: return the updated document
            session  //session: use the same session for the operation
          }
        );

        //if itemDetails is not found, throw an error
        if (!itemDetails) {
          const originalItem = await this.itemModel.findById(item.itemId).session(session);
          
          if (!originalItem) {
            throw new NotFoundException(`Item with ID ${item.itemId} not found`);
          } else {
            throw new BadRequestException(
              `Not enough inventory for item ${originalItem.name}. Available: ${originalItem.quantity}, Requested: ${item.quantity}`
            );
          }
        }
        
        //if itemDetails.quantity is 0, update the stock to false
        if (itemDetails.quantity === 0) {
          await this.itemModel.updateOne(
            { _id: item.itemId },
            { stock: false },
            { session }
          );
        }
        
      }

      if (!createCartDto.status) {
        createCartDto.status = 'pending';
      }

      const newCart = await this.cartModel.create([createCartDto], { session }).then(carts => carts[0]);
      
      if (newCart) {
        await this.userService.updateUserCart(createCartDto.userId, newCart._id);
      }
      
      await session.commitTransaction();
      
      return newCart;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
    doc.text(
      `Order Date: ${new Date(cartInfo.purchaseDate).toLocaleDateString()}`,
    );
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
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, {
      align: 'center',
    });

    // Kết thúc và gửi dữ liệu
    doc.end();
  }

  //---------------PATCH /cart

  async updateCart(cartId: string, updateData: any): Promise<CartModel | null> {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new BadRequestException('Invalid cart ID');
    }

    const session = await this.cartModel.db.startSession();
    
    try {
      session.startTransaction();
      
      const cart = await this.cartModel.findById(cartId).session(session);
      
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
  
      const oldStatus = cart.status;
      const newStatus = updateData.status;
  
      if (newStatus && oldStatus !== newStatus) {
        await this.handleInventoryUpdate(cart, oldStatus, newStatus);
      }
  
      const updatedCart = await this.cartModel.findByIdAndUpdate(
        cartId, 
        updateData, 
        { new: true, session }
      );
      
      await session.commitTransaction();
      
      return updatedCart;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Helper method to handle inventory updates based on cart status changes
  private async handleInventoryUpdate(
    cart: CartModel,
    oldStatus: string,
    newStatus: string,
  ) {
    const session = await this.cartModel.db.startSession();
    
    try {
      session.startTransaction();
      
      // Case: Canceling a cart (from pending or done) - add quantities back to inventory
      if (newStatus === 'cancel' && (oldStatus === 'pending' || oldStatus === 'done')) {
        for (const item of cart.items) {
          await this.increaseItemQuantity(item.itemId, item.quantity, session);
        }
      }
      
      // Case: Moving from canceled back to pending or done - decrease quantities again
      else if (oldStatus === 'cancel' && (newStatus === 'pending' || newStatus === 'done')) {
        for (const item of cart.items) {
          const itemDetails = await this.itemModel.findById(item.itemId).session(session);
          
          if (!itemDetails) {
            throw new NotFoundException(`Item with ID ${item.itemId} not found`);
          }
          
          if (itemDetails.quantity < item.quantity) {
            throw new BadRequestException(
              `Cannot restore cart to ${newStatus} status. Not enough inventory for item ${itemDetails.name}.`
            );
          }
        }
        
        for (const item of cart.items) {
          await this.decreaseItemQuantity(item.itemId, item.quantity, session);
        }
      }
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Helper to decrease item quantity
  private async decreaseItemQuantity(
    itemId: mongoose.Schema.Types.ObjectId,
    quantity: number,
    session?: mongoose.ClientSession,
  ) {
    const options = session ? { session } : {};
    
    const item = await this.itemModel.findOneAndUpdate(
      { 
        _id: itemId,
        quantity: { $gte: quantity }
      },
      { 
        $inc: { quantity: -quantity } 
      },
      { 
        new: true,
        ...options
      }
    );

    if (!item) {
      const originalItem = await this.itemModel.findById(itemId, null, options);
      
      if (!originalItem) {
        throw new NotFoundException(`Item with ID ${itemId} not found`);
      } else {
        throw new BadRequestException(
          `Not enough inventory for item ${originalItem.name}. Available: ${originalItem.quantity}, Requested: ${quantity}`
        );
      }
    }

    if (item.quantity === 0) {
      await this.itemModel.updateOne(
        { _id: itemId },
        { stock: false },
        options
      );
    }
    
    return item;
  }

  // Helper to increase item quantity
  private async increaseItemQuantity(
    itemId: mongoose.Schema.Types.ObjectId,
    quantity: number,
    session?: mongoose.ClientSession,
  ) {
    const options = session ? { session } : {};
    
    const item = await this.itemModel.findOneAndUpdate(
      { _id: itemId },
      { 
        $inc: { quantity: quantity },
        $set: { stock: true }
      },
      { 
        new: true,
        ...options 
      }
    );

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }
    
    return item;
  }
}