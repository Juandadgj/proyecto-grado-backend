import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(emailOrStudentCode: string, password: string): Promise<object> {
    const user = await this.prisma.user.findFirst({
      where: { username: emailOrStudentCode },
    });
    if (!user) {
      const newUser = await this.prisma.user.create({
        data: { username: emailOrStudentCode },
      });
      return { accessToken: await this.jwtService.signAsync(newUser) };
    } else {
      return { accessToken: await this.jwtService.signAsync(user) };
    }
  }
}
