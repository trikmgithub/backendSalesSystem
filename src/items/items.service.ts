import { InjectModel } from '@nestjs/mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Item as ItemModel } from './schemas/item.schema';
import { Brand as BrandModel } from 'src/brands/shemas/brand.schema';
import { PaginationItemDto } from './dto/pagination-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(ItemModel.name) private itemModel: Model<ItemModel>,
    @InjectModel(BrandModel.name) private brandModel: Model<BrandModel>,
  ) {}

  //--------------------POST /items

  //create new item
  async createItem(createItemDto: CreateItemDto) {
    const { name, price, description, brand, quantity } = createItemDto;

    const brandExist = await this.brandModel.findOne({ _id: brand });

    if (!brandExist) {
      throw new BadRequestException('Brand is not exist');
    }

    const item = await this.itemModel.create({
      name,
      price,
      description,
      brand,
      quantity
    });

    return item;
  }

  //--------------------GET /items

  //get item by id
  async getItemById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid item ID');
    }

    const item = await this.itemModel
      .findById({ _id: id })
      .populate({
        path: 'brand',
        select: 'name description',
      })
      .exec();

    return item;
  }

  //get all items with pagination
  async getAllItems(paginationItem: PaginationItemDto) {
    const page = paginationItem?.page ?? 1;
    const limit = paginationItem?.limit ?? 10;

    const skip = (page - 1) * limit;

    const items = await this.itemModel.find().skip(skip).limit(limit).exec();

    const total = await this.itemModel.countDocuments();

    return {
      meta: {
        currentPage: page,
        sizePage: limit,
        numberItems: total,
        totalPages: Math.ceil(total / limit),
      },
      result: items,
    };
  }
}
