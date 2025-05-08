import { eq, and } from 'drizzle-orm';
import { RepositoryError } from '../errors';
import { DB } from './client';
import { users, waterLogs } from './schemas';
import { equalToday } from './sql-helpers';
import {
  UserEntity,
  UserProfile,
  UserId,
  WaterLogEntity,
} from '../domain/entities';
import {
  IUserRepository,
  IWaterLogRepository,
} from '../domain/interfaces';

export class UserRepository implements IUserRepository {
  constructor(private readonly db: DB) {}

  async create(user: UserEntity) {
    try {
      await this.db.insert(users)
        .values(user)
        .onConflictDoNothing();
    } catch (err) {
      throw new RepositoryError('Failed to create user', err);
    }
  }

  async updateProfile(id: UserId, profile: UserProfile) {
    try {
      await this.db.update(users)
        .set(profile)
        .where(eq(users.id, id));
    } catch (err) {
      throw new RepositoryError('Failed to update user profile', err);
    }
  }

  async updateWeight(id: UserId, weight: number) {
    try {
      await this.db.update(users)
        .set({ weight })
        .where(eq(users.id, id));
    } catch (err) {
      throw new RepositoryError('Failed to update user weight', err);
    }
  }

  async updateTargetWater(id: UserId, target: number) {
    try {
      await this.db.update(users)
        .set({ targetWater: target })
        .where(eq(users.id, id));
    } catch (err) {
      throw new RepositoryError('Failed to update user target water', err);
    }
  }

  async findById(id: UserId) {
    try {
      const [ user ] = await this.db.select()
        .from(users)
        .where(eq(users.id, id));

      return user;
    } catch (err) {
      throw new RepositoryError(
        `Failed to find user by user id ${id}`,
        err
      );
    }
  }

  async getAll(): Promise<UserEntity[]> {
    try {
      const results = await this.db.select().from(users);

      return results;
    } catch (err) {
      throw new RepositoryError('Failed to get all user', err);
    }
  }
}

export class WaterLogRepository implements IWaterLogRepository {
  constructor(private readonly db: DB) {}

  async create(waterLog: WaterLogEntity) {
    try {
      const [ log ] = await this.db.insert(waterLogs)
        .values(waterLog)
        .returning({ amount: waterLogs.amount });

      return log?.amount ?? 0;
    } catch (err) {
      throw new RepositoryError(
        `Failed to create water log by id ${waterLog.userId}`,
        err
      );
    }
  }

  async getTodayWaterLogs(id: UserId) {
    try {
      const logs = await this.db.select()
        .from(waterLogs)
        .where(
          and(
            eq(waterLogs.userId, id),
            equalToday(waterLogs.createdAt),
          )
        );

      return logs;
    } catch (err) {
      throw new RepositoryError('Failed to get today water logs', err);
    }
  }
}