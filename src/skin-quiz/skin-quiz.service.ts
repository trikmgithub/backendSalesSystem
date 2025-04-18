// src/skin-quiz/skin-quiz.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { QuizQuestion } from './schemas/skin-quiz.schema';
import { SkinTypeResult } from './schemas/skin-quiz.schema';
import { UserQuizResponse } from './schemas/skin-quiz.schema';
import { QuizResponseDto } from './dto/quiz-response.dto';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/interface/users.interface';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class SkinQuizService {
  constructor(
    @InjectModel(QuizQuestion.name)
    private questionModel: Model<QuizQuestion>,
    @InjectModel(SkinTypeResult.name)
    private skinTypeResultModel: Model<SkinTypeResult>,
    @InjectModel(UserQuizResponse.name)
    private userQuizResponseModel: Model<UserQuizResponse>,
    private readonly usersService: UsersService,
  ) {}

  // Get all quiz questions
  async getAllQuestions() {
    return await this.questionModel.find().exec();
  }

  // Get active quiz questions
  async getActiveQuestions() {
    return await this.questionModel.find({ isActive: true }).exec();
  }

  // Get not active quiz questions
  async getNotActiveQuestions() {
    return await this.questionModel.find({ isActive: false }).exec();
  }

  // Add a new quiz question
  async addQuestion(createQuestionDto: CreateQuestionDto) {
    try {
      const existingQuestion = await this.questionModel.findOne({
        questionId: createQuestionDto.questionId,
      });

      if (existingQuestion) {
        throw new BadRequestException(
          `Câu hỏi với ID ${createQuestionDto.questionId} đã tồn tại`,
        );
      }

      const newQuestion = await this.questionModel.create(createQuestionDto);
      return newQuestion;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Không thể tạo câu hỏi mới: ' + error.message,
      );
    }
  }

  // Process a user's quiz responses
  async processQuizResponse(quizResponseDto: QuizResponseDto, user: IUser) {
    const { userId, answers } = quizResponseDto;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    let totalScore = 0;
    let maxPossibleScore = 0;

    for (const questionId in answers) {
      const question = await this.questionModel.findOne({
        questionId: questionId,
        isActive: true,
      });

      if (!question) {
        throw new BadRequestException(
          `Question with ID ${questionId} is not active or does not exist`,
        );
      }

      totalScore += answers[questionId];
      maxPossibleScore += question.options.length;
    }
    const scorePercentage = (totalScore / maxPossibleScore) * 100;

    const skinType = await this.determineSkinType(scorePercentage);

    const userResponse = await this.userQuizResponseModel.create({
      userId,
      answers,
      scorePercentage,
      determinedSkinType: skinType,
    });

    await this.usersService.skin(skinType, user);

    const skinTypeInfo = await this.getSkinTypeInfo(skinType);

    return {
      quizResult: userResponse,
      skinTypeInfo,
    };
  }

  // Get all skin type infos
  async getAllSkinTypes() {
    return await this.skinTypeResultModel.find().exec();
  }

  // Add or update a skin type info
  async upsertSkinTypeInfo(skinTypeData: any) {
    const { skinType } = skinTypeData;

    const existingSkinType = await this.skinTypeResultModel.findOne({
      skinType: skinType,
    });

    if (existingSkinType) {
      return await this.skinTypeResultModel.findOneAndUpdate(
        { skinType: skinType },
        skinTypeData,
        { new: true },
      );
    } else {
      return await this.skinTypeResultModel.create(skinTypeData);
    }
  }

  // Get skin type info by type
  async getSkinTypeInfo(skinType: string) {
    return await this.skinTypeResultModel
      .findOne({
        skinType: skinType,
      })
      .exec();
  }

  // Get quiz history for a user
  async getUserQuizHistory(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return await this.userQuizResponseModel
      .find({
        userId: new mongoose.Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Helper function to determine skin type based on score percentage
  private async determineSkinType(scorePercentage: number): Promise<string> {
    const skinTypes = await this.skinTypeResultModel
      .find()
      .sort({ scoreThreshold: 1 }) //increasing by scoreThreshold
      .exec();

    for (const skinType of skinTypes) {
      if (scorePercentage <= skinType.scoreThreshold) {
        return skinType.skinType;
      }
    }

    // If no threshold matches, return the last skin type
    return skinTypes[skinTypes.length - 1].skinType;
  }

  // Update a skin type info
  async updateSkinTypeInfo(skinType: string, skinTypeData: any) {
    const data = await this.skinTypeResultModel.findOneAndUpdate(
      { skinType: skinType },
      skinTypeData,
      { new: true },
    );

    if (!data) {
      throw new BadRequestException('Skin type not found');
    }

    return data;
  }

  // Update a quiz question
  async updateQuestion(
    questionId: string,
    updateQuestionDto: CreateQuestionDto,
  ) {
    return await this.questionModel.findByIdAndUpdate(
      questionId,
      updateQuestionDto,
      { new: true },
    );
  }

  // Delete a skin type info
  async deleteSkinTypeInfo(skinType: string) {
    const data = await this.skinTypeResultModel.findOneAndDelete({
      skinType: skinType,
    });

    if (!data) {
      throw new BadRequestException('Skin type not found');
    }

    return data;
  }

  // Delete a quiz question
  async deleteQuestion(questionId: string) {
    return await this.questionModel.findByIdAndDelete(questionId);
  }
}
