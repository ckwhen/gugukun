import { eq, and } from 'drizzle-orm';
import { DB } from './client';
import { users, waterLogs } from './schemas';
import { sum, equalToday } from './sql-helpers';
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
    await this.db.insert(users)
      .values(user)
      .onConflictDoNothing();
  }

  async updateProfile(id: UserId, profile: UserProfile) {
    await this.db.update(users)
      .set(profile)
      .where(eq(users.id, id));
  }

  async updateWeight(id: UserId, weight: number) {
    await this.db.update(users)
      .set({ weight })
      .where(eq(users.id, id));
  }

  async updateTargetWater(id: UserId, target: number) {
    await this.db.update(users)
      .set({ targetWater: target })
      .where(eq(users.id, id));
  }

  async findById(id: UserId): Promise<UserEntity> {
    const [ user ] = await this.db.select()
      .from(users)
      .where(eq(users.id, id));

    return user;
  }

  async getAll(): Promise<UserEntity[]> {
    const results = await this.db.select().from(users);

    return results;
  }
}

export class WaterLogRepository implements IWaterLogRepository {
  constructor(private readonly db: DB) {}

  async create(waterLog: WaterLogEntity) {
    const [ log ] = await this.db.insert(waterLogs)
      .values(waterLog)
      .returning({ amount: waterLogs.amount });

    return log?.amount ?? 0;
  }

  async getTodayWaterLogs(id: UserId) {
    const logs = await this.db.select()
      .from(waterLogs)
      .where(
        and(
          eq(waterLogs.userId, id),
          equalToday(waterLogs.createdAt),
        )
      );

    return logs;
  }
}