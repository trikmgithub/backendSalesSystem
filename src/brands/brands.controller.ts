import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  //------------POST /brands
  @ResponseMessage('Create new brand successfully')
  @Post('/create')
  async createNewBrand(@Body() createBrandDto: CreateBrandDto) {
    const newBrand = await this.brandsService.createNewBrand(createBrandDto);

    return {
      newBrand,
    };
  }

  //------------GET /brands
}
