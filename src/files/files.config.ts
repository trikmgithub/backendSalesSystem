import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

export const MulterConfig = MulterModule.register({
  storage: multer.memoryStorage(), // Lưu file vào bộ nhớ tạm (RAM)
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});
