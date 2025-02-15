import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import ms from 'ms';

@Injectable()
export class ZalopayService {
  private config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHHfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
  };

  async createPayment(): Promise<any> {
    const embed_data = {};
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear().toString().slice(-2)}${(
      '0' + (currentDate.getMonth() + 1)
    ).slice(-2)}${('0' + currentDate.getDate()).slice(-2)}`;

    const order: any = {
      app_id: this.config.app_id,
      app_trans_id: `${formattedDate}_${transID}`,
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 50000,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: 'zalopayapp',
      expiry_time: Date.now() + ms('15m'), // Thêm thời gian hết hạn (15 phút)
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = `${this.config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, this.config.key1).toString();

    try {
      const response = await axios.post(this.config.endpoint, null, {
        params: order,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error from ZaloPay API: ${error.message}`);
    }
  }
}
