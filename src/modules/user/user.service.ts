import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { SignInUserDto, SignInUserResponseDto } from './dto/signin-user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';
import { SignUpUserDto } from './dto/signup-user.dto';

const SECRET = 'af7e2eb1-e3e9-49c9-9191-f2ad0420bad0';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username, deletedAt: IsNull() });
  }

  async findOneById(id: number): Promise<User> | null {
    return this.userRepository.findOne({ id, deletedAt: IsNull() });
  }

  async decodeUser(token: string): Promise<User> | null {
    const decoded = jwt.decode(token);

    return this.findOneById(decoded['user_id']);
  }

  async signIn(signInUserDto: SignInUserDto): Promise<SignInUserResponseDto> {
    const user = await this.findOneByUsername(signInUserDto.username);

    if (user == null) {
      throw new UnauthorizedException('password or username wrong');
    }

    const isPasswordMatch = compareSync(signInUserDto.password, user.password);

    if (isPasswordMatch) {
      const encodedToken = jwt.sign({ user_id: user.id }, SECRET);
      const response = new SignInUserResponseDto();
      response.username = user.username;
      response.token = encodedToken;

      return response;
    }

    throw new UnauthorizedException('password or username wrong');
  }

  async signUp(signUpUserDto: SignUpUserDto): Promise<User> {
    const newUser: User = Object.assign(new User(), signUpUserDto);
    newUser.password = hashSync(signUpUserDto.password, 10);

    return this.userRepository.save(newUser);
  }
}
