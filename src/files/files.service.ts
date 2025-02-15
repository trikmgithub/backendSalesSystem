import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {
      cloudinary.config({
        cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
        api_key: this.configService.get('CLOUDINARY_API_KEY'),
        api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
      });
    }
  
    // Upload file từ buffer lên Cloudinary
    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'uploads' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(file.buffer);
      });
    }
}
