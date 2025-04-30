import { eq, and } from 'drizzle-orm';
import { users, waterLogs } from './schemas';
import { sum, equalToday } from './sql-helpers';
import {
  UserEntity,
  UserId,
  WaterLogEntity,
} from '../domain/entities';
import {
  IUserRepository,
  IWaterLogRepository,
} from '../domain/interfaces';

export class UserRepository implements IUserRepository {
  constructor(private readonly db: any) {}

  async create(user: UserEntity) {
    await this.db.insert(users)
      .values(user)
      .onConflictDoNothing();
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

  async findById(id: UserId): Promise<UserEntity | null> {
    const result = await this.db.select()
      .from(users)
      .where(eq(users.id, id));

    return result[0] || null;
  }

  async getAll(): Promise<UserEntity[]> {
    const results = await this.db.select().from(users);

    return results;
  }
}

export class WaterLogRepository implements IWaterLogRepository {
  constructor(private readonly db: any) {}

  async create(waterLog: WaterLogEntity) {
    const result = await this.db.insert(waterLogs)
      .values(waterLog)
      .returning({ amount: waterLogs.amount });

    return result[0]?.amount ?? 0;
  }

  async getTodayTotal(id: UserId) {
    const result = await this.db.select({ total: sum(waterLogs.amount) })
      .from(waterLogs)
      .where(and(
        eq(waterLogs.userId, id),
        equalToday(waterLogs.createdAt)
      ));

    return Number(result[0]?.total) ?? 0;
  }
}