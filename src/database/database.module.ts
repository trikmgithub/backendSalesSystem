// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { DatabaseSeeder } from './seeder';
import { SkinQuizModule } from 'src/skin-quiz/skin-quiz.module';

@Module({
  imports: [SkinQuizModule],
  providers: [DatabaseSeeder],
})
export class DatabaseModule {}
