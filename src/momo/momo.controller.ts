import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { MomoService } from './momo.service';

@Controller('momo')
export class MomoController {
  constructor(private readonly momoService: MomoService) {}

  @Get('pay')
  async pay(@Query('amount') amount: number) {
    const payUrl = await this.momoService.createPayment(amount);
    return { message: 'Chuyển hướng đến MoMo', payUrl };
  }

  // Thực hiện redirect người dùng
  @Get('pay-redirect')
  @Redirect()
  async payRedirect(@Query('amount') amount: number) {
    const payUrl = await this.momoService.createPayment(amount);
    return { url: payUrl }; // tự động chuyển hướng tới payUrl
  }

  @Get('success')
  handleSuccess(@Query() query) {
    return { message: 'Thanh toán thành công', data: query };
  }

  @Get('ipn')
  handleIPN(@Query() query) {
    console.log('IPN từ MoMo:', query);
    return { message: 'Thông báo nhận từ MoMo', data: query };
  }
}
