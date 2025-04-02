// src/skin-quiz/seed/seed.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizQuestion } from '../schemas/skin-quiz.schema';
import { SkinTypeResult } from '../schemas/skin-quiz.schema';
import { quizQuestionsSeed } from './quiz-questions.seed';
import { skinTypesSeed } from './skin-types.seed';

@Injectable()
export class SkinQuizSeedService {
  private readonly logger = new Logger(SkinQuizSeedService.name);

  constructor(
    @InjectModel(QuizQuestion.name)
    private questionModel: Model<QuizQuestion>,
    @InjectModel(SkinTypeResult.name)
    private skinTypeResultModel: Model<SkinTypeResult>,
  ) {}

  // Make these methods public so they can be called from DatabaseSeeder
  async seedQuizQuestions() {
    try {
      // Check if there are already questions in the database
      const count = await this.questionModel.countDocuments();
      if (count > 0) {
        this.logger.log('Quiz questions already exist, skipping seed');
        return;
      }

      this.logger.log(`Inserting ${quizQuestionsSeed.length} quiz questions`);
      await this.questionModel.insertMany(quizQuestionsSeed);
      this.logger.log('Quiz questions seeded successfully');
    } catch (error) {
      this.logger.error('Error seeding quiz questions:', error.stack);
    }
  }

  async seedSkinTypes() {
    try {
      // Check if there are already skin types in the database
      const count = await this.skinTypeResultModel.countDocuments();
      if (count > 0) {
        this.logger.log('Skin types already exist, skipping seed');
        return;
      }

      this.logger.log(`Preparing to seed ${skinTypesSeed.length} skin types`);

      // Clone the seed data to avoid modifying the original
      const skinTypesToInsert = JSON.parse(JSON.stringify(skinTypesSeed));

      // Seed without product recommendations for now
      // We'll leave the recommendedProducts array empty
      skinTypesToInsert.forEach((skinType) => {
        skinType.recommendedProducts = [];
      });

      // Insert all skin types with empty recommended products arrays
      this.logger.log('Inserting skin types into database');
      await this.skinTypeResultModel.insertMany(skinTypesToInsert);
      this.logger.log('Skin types seeded successfully');
    } catch (error) {
      this.logger.error('Error seeding skin types:', error.stack);
    }
  }
}
