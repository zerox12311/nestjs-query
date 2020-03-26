import { getModelToken } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { getSequelizeQueryServiceKey } from '../src/decorators';
import { createSequelizeQueryServiceProviders } from '../src/providers';
import { SequelizeQueryService } from '../src/services';

describe('createTypeOrmQueryServiceProviders', () => {
  it('should create a provider for the entity', () => {
    class TestEntity extends Model<TestEntity> {}
    const providers = createSequelizeQueryServiceProviders([TestEntity]);
    expect(providers).toHaveLength(1);
    expect(providers[0].provide).toBe(getSequelizeQueryServiceKey(TestEntity));
    expect(providers[0].inject).toEqual([getModelToken(TestEntity)]);
    expect(providers[0].useFactory(TestEntity)).toBeInstanceOf(SequelizeQueryService);
  });
});
