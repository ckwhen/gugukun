import { UserEntity } from './entities';
import { IUserRepository } from './interfaces';
import { RuleMatch } from '../types';
import { rules, AMOUNT_PER_WEIGHT } from '../utils/contants';

export class UserService {
  constructor(private readonly repo: IUserRepository) {}

  async handleUserCreate(userId: string) {
    await this.repo.create(<UserEntity>{ id: userId });
  }

  async handleUserSetting(userId: string, message: string) {
    const match: RuleMatch = message.match(rules.setting);
    let amount = 0;
    let unit = 'cc';
    let targetWater = 0;

    if (match) {
      amount = parseFloat(match[1]);
      unit = match[2];
    }

    if (unit === 'cc') {
      targetWater = amount;
    }

    if (unit === 'kg') {
      targetWater = AMOUNT_PER_WEIGHT * amount;

      await this.repo.updateWeight(userId, amount);
    }

    await this.repo.updateTargetWater(userId, targetWater);
  }
}
