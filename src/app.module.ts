import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { BrandsModule } from './brands/brands.module';
import { FilesModule } from './files/files.module';
import { EmailModule } from './email/email.module';
import { CartModule } from './cart/cart.module';
import { PayosModule } from './payos/payos.module';
import { SkinQuizModule } from './skin-quiz/skin-quiz.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    ItemsModule,
    PermissionsModule,
    RolesModule,
    BrandsModule,
    FilesModule,
    EmailModule,
    CartModule,
    PayosModule,
    SkinQuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
