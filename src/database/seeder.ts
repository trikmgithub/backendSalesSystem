// src/database/seeder.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SkinQuizSeedService } from 'src/skin-quiz/seed/seed.service';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(private readonly skinQuizSeedService: SkinQuizSeedService) {}

  async onApplicationBootstrap() {
    this.logger.log('Starting database seeding...');

    try {
      // Manually trigger seeding process
      await this.seedSkinQuizData();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Database seeding failed', error.stack);
    }
  }

  private async seedSkinQuizData() {
    this.logger.log('Seeding skin quiz questions...');
    await this.skinQuizSeedService.seedQuizQuestions();

    this.logger.log('Seeding skin type information...');
    await this.skinQuizSeedService.seedSkinTypes();
  }
}
