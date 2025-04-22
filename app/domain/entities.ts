export type UserId = string;

export interface UserEntity {
  id: UserId;
  weight?: number | null;
  targetWater?: number | null;
}

export interface WaterLogEntity {
  userId: UserId,
  amount: number;
}
