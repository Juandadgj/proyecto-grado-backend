import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<object> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const { ...dataUser } = user;
    delete dataUser.password;
    return dataUser;
  }
}
