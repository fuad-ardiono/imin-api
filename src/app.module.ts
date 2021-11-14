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
import { Ingredient } from './modules/ingredient/entities/ingredient.entity';
import { SuperRaw } from './modules/ingredient/entities/super-raw.entity';
import { IngredientState } from './modules/ingredient/entities/ingredient-state.entity';
import { IngredientStateSuperRaw } from './modules/ingredient/entities/ingredient-state-super-raw.entity';
import { IngredientType } from './modules/ingredient/entities/ingredient-type.entity';
import { IngredientTypeSeafood } from './modules/ingredient/entities/ingredient-type-seafood.entity';
import { Seafood } from './modules/ingredient/entities/seafood.entity';
import { InflowModule } from './modules/inflow/inflow.module';
import { Inflow } from './modules/inflow/entities/inflow.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'imin_technical_test',
      entities: [
        User,
        MeasurementUnit,
        SuperRaw,
        Seafood,
        Ingredient,
        IngredientState,
        IngredientStateSuperRaw,
        IngredientType,
        IngredientTypeSeafood,
        Inflow,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    MeasurementUnitModule,
    IngredientModule,
    InflowModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).exclude('user').forRoutes('/*');
  }
}
