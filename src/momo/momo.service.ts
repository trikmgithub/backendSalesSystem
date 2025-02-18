import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MomoService {
  private accessKey = 'F8BBA842ECF85';
  private secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  private partnerCode = 'MOMO';
  private orderInfo = 'pay with MoMo';
  private redirectUrl =
    'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
  private ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
  private requestType = 'payWithMethod';
  private lang = 'vi';

  constructor(private readonly httpService: HttpService) {}

  async createPayment(amount: number): Promise<string> {
    const orderId = this.partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = '';
    const autoCapture = true;
    const orderGroupId = '';

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${this.orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${this.requestType}`;
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: this.orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      lang: this.lang,
      requestType: this.requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'https://test-payment.momo.vn/v2/gateway/api/create',
          requestBody,
        ),
      );

      // Nếu thành công, trả về payUrl để người dùng redirect
      if (response.data && response.data.payUrl) {
        return response.data.payUrl; // trả về payUrl để redirect người dùng
      } else {
        throw new Error('Không có payUrl trong phản hồi');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thanh toán MoMo:', error);
      throw new Error('Không thể thực hiện thanh toán với MoMo.');
    }
  }
}
