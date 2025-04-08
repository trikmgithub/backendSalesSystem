import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class EmailService {
  private otpStorage = new Map<string, string>(); // Lưu OTP tạm thời trong bộ nhớ RAM của server

  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
    private readonly cartService: CartService,
  ) {}

  // Tạo mã OTP 6 chữ số
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Lưu OTP vào bộ nhớ tạm thời
  saveOTP(email: string, otp: string) {
    this.otpStorage.set(email, otp);
    setTimeout(() => this.otpStorage.delete(email), 1 * 60 * 1000); // Hết hạn sau 1 phút
  }

  // Gửi OTP qua email
  async sendOTP(email: string) {
    const isExisted = await this.userService.findOneByEmail(email);

    if (isExisted) {
      throw new BadRequestException('Email is existed');
    }

    const otp = this.generateOTP();
    this.saveOTP(email, otp);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Beauty Skin OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
      });
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to send OTP', error };
    }
  }

  // Gửi OTP qua email
  async sendOtpForgetPassword(email: string) {
    const isExisted = await this.userService.findOneByEmail(email);

    if (!isExisted) {
      throw new BadRequestException('Email is not existed');
    }

    const otp = this.generateOTP();
    this.saveOTP(email, otp);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Beauty Skin OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
      });
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to send OTP', error };
    }
  }

  // Xác thực OTP
  verifyOTP(email: string, otp: string) {
    const storedOTP = this.otpStorage.get(email);
    if (storedOTP && storedOTP === otp) {
      this.otpStorage.delete(email);
      return { success: true, message: 'OTP verified' };
    }
    return { success: false, message: 'Invalid or expired OTP' };
  }

  async sendInvoiceEmail(email: string, cartId: string) {
    try {
      // Generate PDF buffer in memory instead of directly piping to response
      const pdfBuffer = await this.generateInvoicePDF(cartId);

      // Send the email with PDF attachment
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Order Invoice',
        text: 'Thank you for your purchase! Please find your invoice attached.',
        html: `
          <h2>Thank you for your purchase!</h2>
          <p>Your order has been confirmed. Please find your invoice attached to this email.</p>
          <p>Order ID: ${cartId}</p>
          <p>If you have any questions about your order, please contact our customer support.</p>
        `,
        attachments: [
          {
            filename: `invoice-${cartId}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

      return { success: true, message: 'Invoice sent successfully' };
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return { success: false, message: 'Failed to send invoice email', error };
    }
  }

  async generateInvoicePDF(cartId: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));

        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        const cartInfo = await this.cartService.getCartById(cartId);

        doc.fontSize(25).text('SKIN BEAUTY INVOICE', { align: 'center' });
        doc.moveDown();

        // Add order information
        doc.fontSize(14).text('Order Information', { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(12).text(`Customer gmail: ${cartInfo.recipientInfo.email}`);
        doc.fontSize(12).text(`Customer phone: ${cartInfo.recipientInfo.phone}`);
        doc.text(
          `Order Date: ${
            (() => {
              const purchaseDate = new Date(cartInfo.purchaseDate);
              console.log('Purchase Date:', purchaseDate);
              return `${purchaseDate.getDate()}/${purchaseDate.getMonth() + 1}/${purchaseDate.getFullYear()}`;
            })()
          }`,
        );
        doc.text(`Payment Method: ${cartInfo.paymentMethod || 'N/A'}`);
        doc.moveDown();

        doc.fontSize(14).text('Ordered Items', { underline: true });
        doc.moveDown(0.5);

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
        doc.moveDown(2);

        let itemTotal = 0;
        cartInfo.items.forEach((item) => {
          y = doc.y;
          doc.text(item.itemName.toString(), 50, y, {
            width: 180,
            continued: false,
          });
          doc.text(item.quantity.toString(), 250, y);
          doc.text(`${item.price.toFixed(2)} vnd`, 350, y);
          const total = item.quantity * item.price;
          itemTotal += total;
          doc.text(`${total.toFixed(2)} vnd`, 450, y);
          doc.moveDown();
        });

        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();
        doc
          .fontSize(12)
          .text(
            `Total Amount: ${cartInfo.totalAmount.toFixed(2)} vnd`,
            350,
            doc.y,
          );

        doc.moveDown(2);
        doc
          .fontSize(10)
          .text('Thank you for your purchase!', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
