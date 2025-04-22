import { eq } from 'drizzle-orm';
import { users } from './schemas';
import { UserEntity } from '../domain/entities';
import { IUserRepository } from '../domain/interfaces';

export class UserRepository implements IUserRepository {
  constructor(private readonly db: any) {}

  async create(user: UserEntity) {
    await this.db.insert(users)
      .values(user)
      .onConflictDoNothing()
      .run();
  }

  async updateWeight(id: string, weight: number) {
    await this.db.update(users)
      .set({ weight })
      .where(eq(users.id, id))
      .run();
  }

  async updateTargetWater(id: string, target: number) {
    await this.db.update(users)
      .set({ targetWater: target })
      .where(eq(users.id, id))
      .run();
  }

  async findById(id: string): Promise<UserEntity | null> {
    const result = await this.db.select()
      .from(users)
      .where(eq(users.id, id))
      .all();

    return result[0] || null;
  }
}