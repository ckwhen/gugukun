import { eq, sql } from 'drizzle-orm';
import { users, waterLogs } from './schemas';
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
      .onConflictDoNothing()
      .run();
  }

  async updateWeight(id: UserId, weight: number) {
    await this.db.update(users)
      .set({ weight })
      .where(eq(users.id, id))
      .run();
  }

  async updateTargetWater(id: UserId, target: number) {
    await this.db.update(users)
      .set({ targetWater: target })
      .where(eq(users.id, id))
      .run();
  }

  async findById(id: UserId): Promise<UserEntity | null> {
    const result = await this.db.select()
      .from(users)
      .where(eq(users.id, id))
      .all();

    return result[0] || null;
  }

  async getAll(): Promise<UserEntity[]> {
    const results = await this.db.select().from(users);

    return results;
  }
}

const today = new Date().toISOString().slice(0, 10);

export class WaterLogRepository implements IWaterLogRepository {
  constructor(private readonly db: any) {}

  async create(waterLog: WaterLogEntity) {
    const result = await this.db.insert(waterLogs)
      .values(waterLog)
      .returning({ amount: waterLogs.amount });

    return result[0]?.amount ?? 0;
  }

  async getTodayTotal(id: UserId) {
    const result = await this.db.select({ total: sql<number>`sum(${waterLogs.amount})` })
      .from(waterLogs)
      .where(sql`${waterLogs.userId} = ${id} AND ${waterLogs.createdAt} LIKE ${today + '%'}`)
      .get();

    return result?.total ?? 0;
  }
}