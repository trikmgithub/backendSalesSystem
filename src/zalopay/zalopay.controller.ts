import { Controller, Get } from '@nestjs/common';
import { ZalopayService } from './zalopay.service';

@Controller('zalo')
export class ZalopayController {
  constructor(private readonly zalopayService: ZalopayService) {}

  @Get('pay')
  async createPayment() {
    try {
      const paymentUrl = await this.zalopayService.createPayment();
      return paymentUrl; // Trả về thông tin thanh toán từ ZaloPay API
    } catch (error) {
      return { message: 'Có lỗi xảy ra', error: error.message };
    }
  }
}
