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
    const OR = [
      {
        email: emailOrStudentCode,
      },
      {
        studentCode: emailOrStudentCode,
      },
    ];
    const user = await this.prisma.user.findFirst({ where: { OR } });
    if (user?.password !== password) {
      console.log('password', password);
      // console.log('user.password', user.password);
      throw new UnauthorizedException();
    }
    const { ...dataUser } = user;
    delete dataUser.password;
    return {
      accessToken: await this.jwtService.signAsync(dataUser),
    };
  }

  async signUp(data: Prisma.UserCreateInput): Promise<object> {
    const user = await this.prisma.user.create({ data });
    const { ...dataUser } = user;
    delete dataUser.password;
    return {
      accessToken: await this.jwtService.signAsync(dataUser),
    };
  }
}
