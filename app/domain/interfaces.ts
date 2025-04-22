import { UserEntity, UserId, WaterLogEntity } from './entities';

export interface IUserRepository {
  create(user: UserEntity): Promise<void>;
  findById(id: UserId): Promise<UserEntity | null>;
  updateWeight(id: UserId, weight: number): Promise<void>;
  updateTargetWater(id: UserId, target: number): Promise<void>;
}

export interface IWaterLogRepository {
  create(waterlog: WaterLogEntity): Promise<number>;
  getTodayTotal(id: UserId): Promise<number>;
}
