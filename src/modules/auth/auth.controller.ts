import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.emailOrStudentCode, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() signUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
