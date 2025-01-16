import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand as BrandModel } from './shemas/brand.schema';
import { Model } from 'mongoose';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(BrandModel.name) private brandModel: Model<BrandModel>,
  ) {}

  //---------------POST /brands

  //create new brand
  async createNewBrand(createBrandDto: CreateBrandDto) {
    const {name, description, items} = createBrandDto;

    const isExist = this.brandModel.findOne({ name });

    if (isExist) {
      console.log(isExist)
      throw new BadRequestException('Brand da ton tai');
    }

    const newBrand = await this.brandModel.create({
      name,
      description,
      items 
    })

    return newBrand;
  }

  //---------------GET /brands
  

  //---------------PATCH /brands

  //---------------DELETE /brands


}
