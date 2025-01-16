import { InjectModel } from '@nestjs/mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Item as ItemModel } from './schemas/item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(ItemModel.name) private itemModel: Model<ItemModel>,
  ) {}
  
  //--------------------POST /items

  //create new item
  async createNewItem(createItemDto: CreateItemDto) {
    const { name, price, description, brand } = createItemDto;

    let newItem = await this.itemModel.create({
      name,
      price,
      description,
      brand
    });

    return newItem;
  }

  //--------------------GET /items

  //get item by id
  async getItemById(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid item ID');
    }

    const item = await this.itemModel.findById({ _id: id});

    return item;
  }


}
