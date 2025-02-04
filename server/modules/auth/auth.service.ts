import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserDocument } from '../user/user.model';

class AuthService {
  private JWT_SECRET: string;
  private JWT_EXPIRE: string;

  constructor() {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRE) {
      throw new Error('JWT configuration is missing');
    }
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_EXPIRE = process.env.JWT_EXPIRE;
  }

  public generateToken(user: UserDocument): string {
    const signOptions: SignOptions = {
      expiresIn: '30d',
    };

    return jwt.sign(
      {
        id: user._id,
        role: user.user_roles,
      },
      this.JWT_SECRET,
      signOptions,
    );
  }

  // match user entered password to hash password in database
  public async matchPassword(enteredPassword: string, user: UserDocument) {
    return await bcrypt.compare(enteredPassword, user.password);
  }
}

export const authService = new AuthService();
export default authService;
