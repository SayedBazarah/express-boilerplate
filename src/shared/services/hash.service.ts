import * as argon2 from 'argon2';

export class HashService {
  /**
   * Hashes data using Argon2id (default)
   * Argon2 automatically handles salt generation.
   */
  async hash(data: string): Promise<string> {
    return argon2.hash(data);
  }

  /**
   * Verifies a plain text string against a hash.
   * NOTE: argon2.verify takes the HASH first, then the PLAIN text.
   */
  async compare(plain: string, encrypted: string): Promise<boolean> {
    try {
      return await argon2.verify(encrypted, plain);
    } catch (error) {
      // Handle malformed hash errors gracefully if needed
      return false;
    }
  }
}