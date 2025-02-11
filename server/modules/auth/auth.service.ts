import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import User, { UserDocument } from "../user/user.model";
import Token from "../token/token.model";
import crypto from "crypto";
import { sendEmail } from "../../utils/email";
import ErrorResponse from "../../utils/errorResponse";

class AuthService {
  private JWT_SECRET: string;

  constructor() {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRE) {
      throw new Error("JWT configuration is missing");
    }
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  /** @desc generate token for user **/

  public generateToken(user: UserDocument): string {
    const signOptions: SignOptions = {
      expiresIn: "30d",
    };
    return jwt.sign(
      {
        id: user._id,
        role: user.user_roles,
      },
      this.JWT_SECRET,
      signOptions
    );
  }

  /** @desc match user entered password to hash password in database **/

  public async matchPassword(enteredPassword: string, user: UserDocument) {
    return await bcrypt.compare(enteredPassword, user.password);
  }

  /** @desc Password reset email sender **/

  public async sendPasswordResetEmail(user: UserDocument) {
    //generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const salt = 10;
    const hashedToken = await bcrypt.hash(resetToken, Number(salt));

    //save token in database
    await Token.create({ userId: user._id, token: hashedToken });

    //create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/?token=${resetToken}&id=${user._id}`;

    // Send reset email
    return await sendEmail(
      user.email,
      "Password Reset Request",
      `Click the link to reset your password:\n\n${resetUrl}\n\nThis link is valid for 10 minutes.`
    );
  }
}

/** @desc matches hashed token and saves new password **/

export const resetUserPassword = async (
  id: string,
  token: string,
  newPassword: string
) => {
  // Check if token exists in DB
  const tokenRecord = await Token.findOne({ userId: id });
  if (!tokenRecord) {
    throw new ErrorResponse("Invalid or expired token", 400);
  }

  // Compare provided token with hashed token in DB
  const isMatch = await bcrypt.compare(token, tokenRecord.token);
  if (!isMatch) {
    throw new ErrorResponse("Invalid or expired token", 400);
  }

  // Find user by ID
  const user = await User.findById(id);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  // Update user password
  user.password = newPassword;
  await user.save();

  // Delete used token from DB
  await Token.findByIdAndDelete(tokenRecord._id);

  // Send success email
  await sendEmail(
    user.email,
    "Password Reset Successful",
    "Your password has been successfully reset. If you did not perform this action, please contact support immediately."
  );

  return { success: true, message: "Password reset successful!" };
};

export const authService = new AuthService();
export default authService;
