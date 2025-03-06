import { Injectable } from '@nestjs/common';
import { CreatePayoDto } from './dto/create-payo.dto';
import PayOS from '@payos/node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PayosService {
  private payOS: any;

  constructor(private configService: ConfigService) {
    this.payOS = new PayOS(
      this.configService.get<string>('PAYOS_CLIENT_ID'),
      this.configService.get<string>('PAYOS_API_KEY'),
      this.configService.get<string>('PAYOS_CHECKSUM_KEY'),
    );
  }

  async create(createPayoDto: CreatePayoDto) {
    try {
      const orderCode = createPayoDto.orderCode || Number(String(Date.now()).slice(-6));
      
      const paymentBody = {
        orderCode,
        amount: createPayoDto.amount,
        description: createPayoDto.description,
        items: createPayoDto.items,
        returnUrl: createPayoDto.returnUrl,
        cancelUrl: createPayoDto.cancelUrl,
      };

      const paymentLinkResponse = await this.payOS.createPaymentLink(paymentBody);
      return paymentLinkResponse;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const paymentInfo = await this.payOS.getPaymentLinkInformation(id);
      return paymentInfo;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentStatus(id: number) {
    try {
      const paymentStatus = await this.payOS.getPaymentLinkInformation(id);
      return paymentStatus;
    } catch (error) {
      throw error;
    }
  }

  generateOrderCode() {
    return Number(String(Date.now()).slice(-6));
  }
}