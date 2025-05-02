import {
  UserEntity,
  UserId,
  UserDailyWaterProgress,
  WaterLogEntity,
} from './entities';
import { db } from '../db/client';
import { UserRepository, WaterLogRepository } from '../db/repositories';
import { IUserRepository, IWaterLogRepository } from './interfaces';
import { RuleMatch, EventTextMessage } from '../types';
import { contants } from '../utils';

const { rules, AMOUNT_PER_WEIGHT } = contants;

class UserService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly waterLogRepo: IWaterLogRepository
  ) {}

  async handleUserCreate(userId: UserId) {
    await this.userRepo.create(<UserEntity>{ id: userId });
  }

  async handleUserFind(userId: UserId) {
    const user = await this.userRepo.findById(userId);

    return user;
  }

  async handleUserSetting(userId: UserId, message: EventTextMessage) {
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
  }

  async handleWaterLogCreate(userId: UserId, message: EventTextMessage) {
    const match: RuleMatch = message.match(rules.waterRecording);
    let amount = 0;

    if (match) {
      amount = parseFloat(match[2]);
    }

    const logAmount = await this.waterLogRepo.create(<WaterLogEntity>{ userId, amount });

    return logAmount;
  }

  async handleUserWaterProgress(userId: UserId): Promise<UserDailyWaterProgress> {
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
  }
}

export function createUserService(): UserService {
  const userRepo = new UserRepository(db);
  const waterLogRepo = new WaterLogRepository(db);

  return new UserService(userRepo, waterLogRepo);
}

class ReminderService {
  constructor(
    private readonly userRepo: IUserRepository
  ) {}

  async getAllUsers() {
    const users = await this.userRepo.getAll();

    return users;
  }
}

export function createReminderService(): ReminderService {
  const userRepo = new UserRepository(db);

  return new ReminderService(userRepo);
}
