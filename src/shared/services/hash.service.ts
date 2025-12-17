import bcrypt from 'bcrypt';
import { APP_CONSTANTS } from '../../core/constants';

export class HashService {
  private readonly saltRounds = APP_CONSTANTS.SECURITY.SALT_ROUNDS;

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}