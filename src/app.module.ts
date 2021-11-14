import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { MeasurementUnitModule } from './modules/measurement-unit/measurement-unit.module';
import { MeasurementUnit } from './modules/measurement-unit/entities/measurement-unit.entity';
import { UserMiddleware } from './middleware/user.middleware';
import { UserService } from './modules/user/user.service';
import { IngredientModule } from './modules/ingredient/ingredient.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'imin_technical_test',
      entities: [User, MeasurementUnit],
      synchronize: true,
    }),
    UserModule,
    MeasurementUnitModule,
    TypeOrmModule.forFeature([User]),
    IngredientModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('measurement-unit');
  }
}
