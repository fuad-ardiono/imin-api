import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.userService.signUp(signUpUserDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInUserDto: SignInUserDto) {
    return this.userService.signIn(signInUserDto);
  }
}
