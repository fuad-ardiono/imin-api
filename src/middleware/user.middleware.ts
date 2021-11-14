import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { User } from '../modules/user/entities/user.entity';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: any, next: () => void) {
    const headers = req.headers;

    if (headers.authorization) {
      const user: User = await this.userService.decodeUser(
        headers.authorization,
      );

      if (!user) throw new UnauthorizedException('Unauthenticated');

      req['user'] = user;
      next();
    } else {
      throw new UnauthorizedException('Unauthenticated');
    }
  }
}
