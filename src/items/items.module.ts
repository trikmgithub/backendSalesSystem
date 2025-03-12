import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { Brand, BrandSchema } from 'src/brands/shemas/brand.schema';
import { FilesModule } from 'src/files/files.module';
import { BrandsModule } from 'src/brands/brands.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
    FilesModule,
    BrandsModule
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
