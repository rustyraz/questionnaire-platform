import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string): Promise<{ accessToken: string }> {
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!expectedUsername || !expectedPasswordHash) {
      throw new UnauthorizedException('Admin credentials not configured');
    }

    const usernameMatches = username === expectedUsername;
    const passwordMatches = usernameMatches && (await bcrypt.compare(password, expectedPasswordHash));

    if (!usernameMatches || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({ sub: username, role: 'admin' });
    return { accessToken };
  }
}