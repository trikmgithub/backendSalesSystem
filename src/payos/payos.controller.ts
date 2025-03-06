import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Res } from '@nestjs/common';
import { PayosService } from './payos.service';
import { CreatePayoDto } from './dto/create-payo.dto';
import { UpdatePayoDto } from './dto/update-payo.dto';
import { Response } from 'express';
import { Public } from 'src/decorator/customize';

@Controller('payos')
export class PayosController {
  constructor(private readonly payosService: PayosService) {}

  @Post()
  async create(@Body() createPayoDto: CreatePayoDto) {
    return this.payosService.create(createPayoDto);
  }

  @Public()
  @Post('create-payment-link')
  async createPaymentLink(@Body() createPayoDto: CreatePayoDto, @Res() res: Response) {
    try {
      const paymentLink = await this.payosService.create(createPayoDto);
      return res.redirect(paymentLink.checkoutUrl);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payosService.findOne(+id);
  }

  @Get('payment-status/:id')
  getPaymentStatus(@Param('id') id: string) {
    return this.payosService.getPaymentStatus(+id);
  }
}