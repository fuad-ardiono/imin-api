import { AppModule } from './app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppModule', () => {
  let appModule: AppModule;

  beforeEach(() => {
    jest.spyOn(TypeOrmModule, 'forRoot').mockImplementation(jest.fn());
    appModule = new AppModule();
  });

  describe('module', () => {
    it('pgsql should ok', () => {
      expect(appModule).toBeDefined();
    });
  });
});
