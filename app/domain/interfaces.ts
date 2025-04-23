import { UserEntity, UserId, WaterLogEntity } from './entities';

export interface IUserRepository {
  create(user: UserEntity): Promise<void>;
  findById(id: UserId): Promise<UserEntity | null>;
  updateWeight(id: UserId, weight: number): Promise<void>;
  updateTargetWater(id: UserId, target: number): Promise<void>;
  getAll(): Promise<UserEntity[]>;
}

export interface IWaterLogRepository {
  create(waterlog: WaterLogEntity): Promise<number>;
  getTodayTotal(id: UserId): Promise<number>;
}

export interface IHttpClient {
  post<T>(url: string, data: unknown, configs?: unknown): Promise<T>
}

export interface ILineMessenger {
  sendMessage(userId: UserId, message: string): Promise<void> 
}
