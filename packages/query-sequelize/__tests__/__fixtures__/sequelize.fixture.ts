// this is needed to create a query builder in typeorm :(
import { TestEntityTestRelationEntity } from './test-entity-test-relation.entity';
import { TestRelation } from './test-relation.entity';
import { TestEntity } from './test.entity';
import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  database: ':memory:',
  models: [TestEntity, TestEntityTestRelationEntity, TestRelation],
});

export function syncSequelize(): Promise<Sequelize> {
  return sequelize.sync();
}

export function closeSequelize(): Promise<void> {
  return sequelize.close();
}