import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (error) {
      throw new BadRequestException('Something is wrong with the data', {
        description: error.message,
      });
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
      include: {
        ratings: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async pushRating(data: Record<string, any>) {
    return await this.prisma.user.update({
      where: { id: data.id },
      data: {
        ratings: {
          create: {
            score: data.score,
            type: data.type,
            activityId: data.activityId,
          },
        },
      },
    });
  }
}
