import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

export class AuthService {
  static async login(email: string, pass: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    await this.updateStoredRefreshToken(user.id, refreshToken);

    const { password, hashedRefreshToken, ...userWithoutSecrets } = user;
    return { accessToken, refreshToken, user: userWithoutSecrets };
  }

  static async register(name: string, email: string, pass: string) {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    await this.updateStoredRefreshToken(user.id, refreshToken);

    const { password, hashedRefreshToken, ...userWithoutSecrets } = user;
    return { accessToken, refreshToken, user: userWithoutSecrets };
  }

  static async updateStoredRefreshToken(userId: string, token: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(token, salt);
    await prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedToken },
    });
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.hashedRefreshToken) {
      throw new Error("Invalid session");
    }

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) {
      throw new Error("Invalid session");
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const { password, hashedRefreshToken, ...userWithoutSecrets } = user;

    return { accessToken, user: userWithoutSecrets };
  }

  static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }
}

