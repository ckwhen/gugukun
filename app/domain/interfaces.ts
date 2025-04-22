import { UserEntity } from './entities';

export interface IUserRepository {
  create(user: UserEntity): Promise<void>;
  findById(id: string): Promise<UserEntity | null>;
  updateWeight(id: string, weight: number): Promise<void>;
  updateTargetWater(id: string, target: number): Promise<void>;
}
