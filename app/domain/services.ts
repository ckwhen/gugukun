import {
  UserEntity,
  UserProfile,
  UserId,
  UserDailyWaterProgress,
  WaterLogEntity,
} from './entities';
import { db } from '../db/client';
import { UserRepository, WaterLogRepository } from '../db/repositories';
import { ServiceError } from '../errors';
import {
  IUserRepository,
  IWaterLogRepository,
  ILineMessenger,
} from './interfaces';
import { RuleMatch, EventTextMessage } from '../types';
import { createLineMessageAdapter } from '../adapters';
import { contants } from '../utils';

const { rules, AMOUNT_PER_WEIGHT } = contants;

class UserService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly waterLogRepo: IWaterLogRepository,
    private readonly lineMessenger: ILineMessenger
  ) {}

  async ensureUserExists(userId: string) {
    try {
      const user = await this.userRepo.findById(userId);
      const profile = await this.lineMessenger.getProfile(userId);

      if (!user) {
        const userWithProfile: UserEntity & UserProfile = {
          id: userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage,
          language: profile.language,
        };

        await this.userRepo.create(userWithProfile);
      } else {
        const updatedProfile: UserProfile = {
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage,
          language: profile.language,
        };
        await this.userRepo.updateProfile(userId, updatedProfile);
      }
    } catch (err) {
      throw new ServiceError('Failed to ensure user exists', err);
    }
  }

  async handleUserFind(userId: UserId) {
    try {
      const user = await this.userRepo.findById(userId);

      return user;
    } catch (err) {
      throw new ServiceError('Failed to handle user find', err);
    }
  }

  async handleUserSetting(userId: UserId, message: EventTextMessage) {
    try {
      const match: RuleMatch = message.match(rules.setting);
      let amount = 0;
      let unit = 'cc';
      let targetWater = 0;

      if (match) {
        amount = parseFloat(match[1]);
        unit = match[2];
      }

      if (unit === 'cc') {
        targetWater = amount;
      }

      if (unit === 'kg') {
        targetWater = AMOUNT_PER_WEIGHT * amount;

        await this.userRepo.updateWeight(userId, amount);
      }

      await this.userRepo.updateTargetWater(userId, targetWater);
    } catch (err) {
      throw new ServiceError('Failed to handle user setting', err);
    }
  }

  async handleWaterLogCreate(userId: UserId, message: EventTextMessage) {
    try {
      const match: RuleMatch = message.match(rules.waterRecording);
      let amount = 0;

      if (match) {
        amount = parseFloat(match[2]);
      }

      const logAmount = await this.waterLogRepo.create(<WaterLogEntity>{ userId, amount });

      return logAmount;
    } catch (err) {
      throw new ServiceError(
        'Failed to handle user water log create',
        err
      );
    }
  }

  async handleUserWaterProgress(userId: UserId): Promise<UserDailyWaterProgress> {
    try {
      const user = await this.userRepo.findById(userId);
      const todayWaterLogs = await this.waterLogRepo.getTodayWaterLogs(userId);

      const targetWater = user.targetWater ?? 0;
      const totalWaterToday = todayWaterLogs
        .reduce((total, log) => total + log.amount, 0);

      const progress: UserDailyWaterProgress = {
        totalWaterToday,
        id: user.id,
        targetWater: targetWater,
        percentage: ((totalWaterToday * 100) / targetWater).toFixed(2) + '%',
      };

      return progress;
    } catch (err) {
      throw new ServiceError(
        'Failed to handle user daily water progress',
        err
      );
    }
  }
}

export function createUserService(): UserService {
  const userRepo = new UserRepository(db);
  const waterLogRepo = new WaterLogRepository(db);
  const lineMessenger = createLineMessageAdapter();

  return new UserService(
    userRepo,
    waterLogRepo,
    lineMessenger
  );
}

class ReminderService {
  constructor(
    private readonly userRepo: IUserRepository
  ) {}

  async getAllUsers() {
    try {
      const users = await this.userRepo.getAll();

      return users;
    } catch (err) {
      throw new ServiceError('Failed to get all users', err);
    }
  }
}

export function createReminderService(): ReminderService {
  const userRepo = new UserRepository(db);

  return new ReminderService(userRepo);
}
