export type UserId = string;

export interface UserEntity {
  id: UserId;
  weight?: number | null;
  targetWater?: number | null;
}

export interface UserProfile {
  displayName: string,
  pictureUrl: string,
  statusMessage: string,
  language: string,
}

export type UserDailyWaterProgress = Pick<UserEntity, 'id' | 'targetWater'> & {
  totalWaterToday: number | 0;
  percentage: string;
};

export interface WaterLogEntity {
  userId: UserId,
  amount: number;
}
