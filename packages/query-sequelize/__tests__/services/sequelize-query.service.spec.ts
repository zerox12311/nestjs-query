import { Query, QueryService } from '@nestjs-query/core';
import { FindOptions } from 'sequelize';
import { instance, mock, when, objectContaining } from 'ts-mockito';
import { ModelCtor } from 'sequelize-typescript';
import { SequelizeQueryService } from '../../src';
import { FilterQueryBuilder } from '../../src/query';
import { closeSequelize, syncSequelize } from '../__fixtures__/sequelize.fixture';
import { TestEntity } from '../__fixtures__/test.entity';
import { TestRelation } from '../__fixtures__/test-relation.entity';

describe('SequelizeQueryService', (): void => {
  beforeAll(() => syncSequelize());

  afterAll(() => closeSequelize());

  const testEntities = (): TestEntity[] => [
    new TestEntity({
      testEntityPk: 'entity-id1',
      stringType: 'foo',
      boolType: true,
      dateType: new Date(),
      numberType: 1,
    }),
    new TestEntity({
      testEntityPk: 'entity-id2',
      stringType: 'bar',
      boolType: false,
      dateType: new Date(),
      numberType: 2,
    }),
  ];

  const testRelations = (entityId: string): TestRelation[] => [
    new TestRelation({ testRelationPk: `relation-${entityId}-id1`, relationName: 'name 1', testEntityId: entityId }),
    new TestRelation({ testRelationPk: `relation-${entityId}-id2`, relationName: 'name 2', testEntityId: entityId }),
  ];

  @QueryService(TestEntity)
  class TestSequelizeQueryService extends SequelizeQueryService<TestEntity> {
    constructor(
      readonly model: ModelCtor<TestEntity>,
      filterQueryBuilder?: FilterQueryBuilder<TestEntity>,
      readonly relationFilterQueryBuilder?: FilterQueryBuilder<TestRelation>,
    ) {
      super(model, filterQueryBuilder);
    }

    getRelationQueryBuilder<Relation>(): FilterQueryBuilder<Relation> {
      return (this.relationFilterQueryBuilder as unknown) as FilterQueryBuilder<Relation>;
    }
  }

  type MockQueryService<Relation = unknown> = {
    mockModelCtor: ModelCtor<TestEntity>;
    queryService: QueryService<TestEntity>;
    mockQueryBuilder: FilterQueryBuilder<TestEntity>;
    mockRelationQueryBuilder: FilterQueryBuilder<TestRelation>;
  };

  function createQueryService<Relation = unknown>(): MockQueryService<Relation> {
    const mockQueryBuilder = mock<FilterQueryBuilder<TestEntity>>(FilterQueryBuilder);
    const mockRelationQueryBuilder = mock<FilterQueryBuilder<TestRelation>>(FilterQueryBuilder);
    const mockModel = mock<ModelCtor<TestEntity>>();
    const queryService = new TestSequelizeQueryService(
      instance(mockModel),
      instance(mockQueryBuilder),
      instance(mockRelationQueryBuilder),
    );
    return { mockQueryBuilder, mockModelCtor: mockModel, queryService, mockRelationQueryBuilder };
  }

  describe('#query', () => {
    it('call select and return the result', async () => {
      const entities = testEntities();
      const query: Query<TestEntity> = { filter: { stringType: { eq: 'foo' } } };
      const findOptions: FindOptions = {};
      const { queryService, mockQueryBuilder, mockModelCtor } = createQueryService();
      when(mockQueryBuilder.findOptions(query)).thenReturn(findOptions);
      when(mockModelCtor.findAll(findOptions)).thenResolve(entities);
      const queryResult = await queryService.query(query);
      expect(queryResult).toEqual(entities);
    });
  });

  describe('#queryRelations', () => {
    const relationName = 'testRelations';
    describe('with one entity', () => {
      it('call select and return the result', async () => {
        const entity = testEntities()[0];
        const relations = testRelations(entity.testEntityPk);
        const query: Query<TestRelation> = { filter: { relationName: { eq: 'name' } } };
        const findOptions: FindOptions = {};
        const mockModel = mock(TestEntity);
        const { queryService, mockModelCtor, mockRelationQueryBuilder } = createQueryService<TestRelation>();
        // @ts-ignore
        when(mockModelCtor.associations).thenReturn({ [relationName]: { target: TestRelation } });
        when(mockRelationQueryBuilder.findOptions(query)).thenReturn(findOptions);
        when(mockModel.$get(relationName, findOptions)).thenResolve(relations);
        const queryResult = await queryService.queryRelations(TestRelation, relationName, instance(mockModel), query);
        expect(queryResult).toEqual(relations);
      });
    });
    describe('with multiple entities', () => {
      it('call select and return the result', async () => {
        const entities = testEntities();
        const entityOneRelations = testRelations(entities[0].testEntityPk);
        const entityTwoRelations = testRelations(entities[1].testEntityPk);
        const query = {
          paging: { limit: 2 },
        };
        const findOptions: FindOptions = {};
        const mockModel = mock(TestEntity);
        const mockModelInstances = [instance(mockModel), instance(mockModel)];
        const { queryService, mockModelCtor, mockRelationQueryBuilder } = createQueryService();
        // @ts-ignore
        when(mockModelCtor.associations).thenReturn({ [relationName]: { target: TestRelation } });
        when(mockRelationQueryBuilder.findOptions(query)).thenReturn(findOptions);
        when(mockModel.$get(relationName, findOptions)).thenResolve(entityOneRelations);
        when(mockModel.$get(relationName, findOptions)).thenResolve(entityTwoRelations);
        const queryResult = await queryService.queryRelations(TestRelation, relationName, mockModelInstances, query);
        expect(queryResult).toEqual(
          new Map([
            [mockModelInstances[0], entityOneRelations],
            [mockModelInstances[1], entityTwoRelations],
          ]),
        );
      });

      it('should return an empty array if no results are found.', async () => {
        const entities = testEntities();
        const entityOneRelations = testRelations(entities[0].testEntityPk);
        const query = {
          paging: { limit: 2 },
        };
        const findOptions: FindOptions = {};
        const mockModel = mock(TestEntity);
        const mockModelInstances = [instance(mockModel), instance(mockModel)];
        const { queryService, mockModelCtor, mockRelationQueryBuilder } = createQueryService();
        // @ts-ignore
        when(mockModelCtor.associations).thenReturn({ [relationName]: { target: TestRelation } });
        when(mockRelationQueryBuilder.findOptions(query)).thenReturn(findOptions);
        when(mockModel.$get(relationName, findOptions)).thenResolve(entityOneRelations);
        when(mockModel.$get(relationName, findOptions)).thenResolve([]);
        const queryResult = await queryService.queryRelations(TestRelation, relationName, mockModelInstances, query);
        expect(queryResult).toEqual(
          new Map([
            [mockModelInstances[0], entityOneRelations],
            [mockModelInstances[0], []],
          ]),
        );
      });
    });
  });

  describe('#findRelation', () => {
    const relationName = 'oneTestRelation';
    describe('with one entity', () => {
      it('call select and return the result', async () => {
        const entity = testEntities()[0];
        const relation = testRelations(entity.testEntityPk)[0];
        const mockModel = mock(TestEntity);
        const { queryService, mockModelCtor } = createQueryService<TestRelation>();
        // @ts-ignore
        when(mockModelCtor.associations).thenReturn({ [relationName]: { target: TestRelation } });
        when(mockModel.$get(relationName)).thenResolve(relation);
        const queryResult = await queryService.findRelation(TestRelation, relationName, instance(mockModel));
        expect(queryResult).toEqual(relation);
      });

      it('should return undefined select if no results are found.', async () => {
        const mockModel = mock(TestEntity);
        const { queryService, mockModelCtor } = createQueryService<TestRelation>();
        // @ts-ignore
        when(mockModelCtor.associations).thenReturn({ [relationName]: { target: TestRelation } });
        when(mockModel.$get(relationName)).thenResolve(null);
        const queryResult = await queryService.findRelation(TestRelation, relationName, instance(mockModel));
        expect(queryResult).toBeUndefined();
      });

      it('throw an error if a relation with that name is not found.', async () => {
        const mockModel = mock(TestEntity);
        const { queryService, mockModelCtor } = createQueryService<TestRelation>();
        // @ts-ignore
        when(mockModelCtor.associations).thenReturn({});
        expect(queryService.findRelation(TestRelation, relationName, instance(mockModel))).rejects.toThrowError(
          `Unable to find relation ${relationName} on TestEntity`,
        );
      });
    });

    describe('with multiple entities', () => {
      it('call select and return the result', async () => {
        const entities = testEntities();
        const entityOneRelation = testRelations(entities[0].testEntityPk)[0];
        const entityTwoRelation = testRelations(entities[1].testEntityPk)[0];
        const mockModel = mock(TestEntity);
        const mockModelInstances = [instance(mockModel), instance(mockModel)];
        const { queryService, mockModelCtor } = createQueryService();
        // @ts-ignore
        when(mockModelCtor.associations).thenReturn({ [relationName]: { target: TestRelation } });
        when(mockModel.$get(relationName)).thenResolve(entityOneRelation);
        when(mockModel.$get(relationName)).thenResolve(entityTwoRelation);
        const queryResult = await queryService.findRelation(TestRelation, relationName, mockModelInstances);
        expect(queryResult).toEqual(
          new Map([
            [mockModelInstances[0], entityOneRelation],
            [mockModelInstances[1], entityTwoRelation],
          ]),
        );
      });

      it('should return undefined select if no results are found.', async () => {
        const entities = testEntities();
        const entityOneRelation = testRelations(entities[0].testEntityPk)[0];
        const mockModel = mock(TestEntity);
        const mockModelInstances = [instance(mockModel), instance(mockModel)];
        const { queryService, mockModelCtor } = createQueryService();
        // @ts-ignore
        when(mockModelCtor.associations).thenReturn({ [relationName]: { target: TestRelation } });
        when(mockModel.$get(relationName)).thenResolve(null);
        when(mockModel.$get(relationName)).thenResolve(entityOneRelation);
        const queryResult = await queryService.findRelation(TestRelation, relationName, mockModelInstances);
        expect(queryResult).toEqual(new Map([[mockModelInstances[0], entityOneRelation]]));
      });
    });
  });

  describe('#addRelations', () => {
    const relationName = 'testRelations';
    it('call select and return the result', async () => {
      const entity = testEntities()[0];
      const relations = testRelations(entity.testEntityPk);
      const relationIds = relations.map(r => r.testRelationPk);
      const mockModel = mock(TestEntity);
      const modelInstance = instance(mockModel);
      const { queryService, mockModelCtor } = createQueryService<TestRelation>();
      // @ts-ignore
      when(mockModelCtor.findByPk(entity.id, objectContaining({ rejectOnEmpty: true }))).thenReturn(modelInstance);
      when(mockModel.$add(relationName, relationIds)).thenResolve(relations);
      const queryResult = await queryService.addRelations(relationName, entity.id, relationIds);
      expect(queryResult).toEqual(modelInstance);
    });
  });

  describe('#setRelation', () => {
    it('call select and return the result', async () => {
      const relationName = 'oneTestRelation';
      it('call select and return the result', async () => {
        const entity = testEntities()[0];
        const relation = testRelations(entity.testEntityPk)[0];
        const relationId = relation.testRelationPk;
        const mockModel = mock(TestEntity);
        const modelInstance = instance(mockModel);
        const { queryService } = createQueryService<TestRelation>();
        // @ts-ignore
        when(mockModel.findById(entity.id)).thenReturn(modelInstance);
        when(mockModel.$set(relationName, relationId)).thenResolve(relation);
        const queryResult = await queryService.setRelation(relationName, entity.id, relationId);
        expect(queryResult).toEqual(modelInstance);
      });
    });
  });

  describe('#removeRelations', () => {
    const relationName = 'testRelations';
    it('call select and return the result', async () => {
      const entity = testEntities()[0];
      const relations = testRelations(entity.testEntityPk);
      const relationIds = relations.map(r => r.testRelationPk);
      const mockModel = mock(TestEntity);
      const modelInstance = instance(mockModel);
      const { queryService } = createQueryService<TestRelation>();
      // @ts-ignore
      when(mockModel.findById(entity.id)).thenReturn(modelInstance);
      when(mockModel.$add(relationName, relationIds)).thenResolve(relations);
      const queryResult = await queryService.removeRelations(relationName, entity.id, relationIds);
      expect(queryResult).toEqual(modelInstance);
    });
  });
  //
  describe('#removeRelation', () => {
    const relationName = 'oneTestRelation';
    it('call select and return the result', async () => {
      const entity = testEntities()[0];
      const relation = testRelations(entity.testEntityPk)[0];
      const relationId = relation.testRelationPk;
      const mockModel = mock(TestEntity);
      const modelInstance = instance(mockModel);
      const { queryService } = createQueryService<TestRelation>();
      // @ts-ignore
      when(mockModel.findById(entity.id)).thenReturn(modelInstance);
      when(mockModel.$set(relationName, relationId)).thenResolve(relation);
      const queryResult = await queryService.removeRelation(relationName, entity.id, relationId);
      expect(queryResult).toEqual(modelInstance);
    });
  });
  //
  // describe('#findById', () => {
  //   it('call findOne on the repo', async () => {
  //     const entity = testEntities()[0];
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockRepo.findOne(entity.testEntityPk)).thenResolve(entity);
  //     const queryResult = await queryService.findById(entity.testEntityPk);
  //     expect(queryResult).toEqual(entity);
  //   });
  //
  //   it('return undefined if not found', async () => {
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.findOne(1)).thenResolve(undefined);
  //     const queryResult = await queryService.findById(1);
  //     expect(queryResult).toBeUndefined();
  //   });
  // });
  //
  // describe('#getById', () => {
  //   it('call findOneOrFail on the repo', async () => {
  //     const entity = testEntities()[0];
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockRepo.findOneOrFail(entity.testEntityPk)).thenResolve(entity);
  //     const queryResult = await queryService.getById(entity.testEntityPk);
  //     expect(queryResult).toEqual(entity);
  //   });
  // });
  //
  // describe('#createMany', () => {
  //   it('call save on the repo with instances of entities when passed plain objects', async () => {
  //     const entities = testEntities();
  //     const entityInstances = entities.map(e => plainToClass(TestEntity, e));
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockRepo.save(entities)).thenResolve(entityInstances);
  //     const queryResult = await queryService.createMany(entities);
  //     expect(queryResult).toEqual(entityInstances);
  //   });
  //
  //   it('call save on the repo with instances of entities when passed instances', async () => {
  //     const entities = testEntities();
  //     const entityInstances = entities.map(e => plainToClass(TestEntity, e));
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockRepo.save(deepEqual(entityInstances))).thenResolve(entityInstances);
  //     const queryResult = await queryService.createMany(entityInstances);
  //     expect(queryResult).toEqual(entityInstances);
  //   });
  // });
  //
  // describe('#createOne', () => {
  //   it('call save on the repo with an instance of the entity when passed a plain object', async () => {
  //     const entity = testEntities()[0];
  //     const entityInstance = plainToClass(TestEntity, entity);
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockRepo.save(deepEqual(entityInstance))).thenResolve(entityInstance);
  //     const queryResult = await queryService.createOne(entityInstance);
  //     expect(queryResult).toEqual(entityInstance);
  //   });
  //
  //   it('call save on the repo with an instance of the entity when passed an instance', async () => {
  //     const entity = testEntities()[0];
  //     const entityInstance = plainToClass(TestEntity, entity);
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockRepo.save(entity)).thenResolve(entityInstance);
  //     const queryResult = await queryService.createOne(entity);
  //     expect(queryResult).toEqual(entityInstance);
  //   });
  // });
  //
  // describe('#deleteMany', () => {
  //   it('create a delete query builder and call execute', async () => {
  //     const affected = 10;
  //     const deleteMany: Filter<TestEntity> = { stringType: { eq: 'foo' } };
  //     const { queryService, mockQueryBuilder, mockRepo } = createQueryService();
  //     const deleteQueryBuilder: DeleteQueryBuilder<TestEntity> = mock(DeleteQueryBuilder);
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockQueryBuilder.delete(objectContaining({ filter: deleteMany }))).thenReturn(instance(deleteQueryBuilder));
  //     when(deleteQueryBuilder.execute()).thenResolve({ raw: undefined, affected });
  //     const queryResult = await queryService.deleteMany(deleteMany);
  //     expect(queryResult).toEqual({ deletedCount: affected });
  //   });
  //
  //   it('should return 0 if affected is not returned', async () => {
  //     const deleteMany: Filter<TestEntity> = { stringType: { eq: 'foo' } };
  //     const { queryService, mockQueryBuilder, mockRepo } = createQueryService();
  //     const deleteQueryBuilder: DeleteQueryBuilder<TestEntity> = mock(DeleteQueryBuilder);
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockQueryBuilder.delete(objectContaining({ filter: deleteMany }))).thenReturn(instance(deleteQueryBuilder));
  //     when(deleteQueryBuilder.execute()).thenResolve({ raw: undefined });
  //     const queryResult = await queryService.deleteMany(deleteMany);
  //     expect(queryResult).toEqual({ deletedCount: 0 });
  //   });
  // });
  //
  // describe('#deleteOne', () => {
  //   it('call getOne and then remove the entity', async () => {
  //     const entity = testEntities()[0];
  //     const { testEntityPk } = entity;
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockRepo.findOneOrFail(testEntityPk)).thenResolve(entity);
  //     when(mockRepo.remove(entity)).thenResolve(entity);
  //     const queryResult = await queryService.deleteOne(testEntityPk);
  //     expect(queryResult).toEqual(entity);
  //   });
  //
  //   it('call fail if the entity is not found', async () => {
  //     const entity = testEntities()[0];
  //     const { testEntityPk } = entity;
  //     const err = new Error('not found');
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.findOneOrFail(testEntityPk)).thenReject(err);
  //     return expect(queryService.deleteOne(testEntityPk)).rejects.toThrowError(err);
  //   });
  // });
  //
  // describe('#updateMany', () => {
  //   it('create a query to update all entities', async () => {
  //     const entity = testEntities()[0];
  //     const update = { stringType: 'baz' };
  //     const filter: Filter<TestEntity> = { testEntityPk: { eq: entity.testEntityPk } };
  //     const affected = 10;
  //     const { queryService, mockQueryBuilder, mockRepo } = createQueryService();
  //     const mockUpdateQueryBuilder: UpdateQueryBuilder<TestEntity> = mock(UpdateQueryBuilder);
  //     const mockUpdateQueryBuilderInstance = instance(mockUpdateQueryBuilder);
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockQueryBuilder.update(objectContaining({ filter }))).thenReturn(mockUpdateQueryBuilderInstance);
  //     when(mockUpdateQueryBuilder.set(objectContaining(update))).thenReturn(mockUpdateQueryBuilderInstance);
  //     when(mockUpdateQueryBuilder.execute()).thenResolve({ generatedMaps: [], raw: undefined, affected });
  //     when(mockRepo.remove(entity)).thenResolve(entity);
  //     const queryResult = await queryService.updateMany(update, filter);
  //     expect(queryResult).toEqual({ updatedCount: affected });
  //   });
  //
  //   it('should return 0 if affected is not defined', async () => {
  //     const entity = testEntities()[0];
  //     const update = { stringType: 'baz' };
  //     const filter: Filter<TestEntity> = { testEntityPk: { eq: entity.testEntityPk } };
  //     const { queryService, mockQueryBuilder, mockRepo } = createQueryService();
  //     const mockUpdateQueryBuilder: UpdateQueryBuilder<TestEntity> = mock(UpdateQueryBuilder);
  //     const mockUpdateQueryBuilderInstance = instance(mockUpdateQueryBuilder);
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockQueryBuilder.update(objectContaining({ filter }))).thenReturn(mockUpdateQueryBuilderInstance);
  //     when(mockUpdateQueryBuilder.set(objectContaining(update))).thenReturn(mockUpdateQueryBuilderInstance);
  //     when(mockUpdateQueryBuilder.execute()).thenResolve({ generatedMaps: [], raw: undefined });
  //     when(mockRepo.remove(entity)).thenResolve(entity);
  //     const queryResult = await queryService.updateMany(update, filter);
  //     expect(queryResult).toEqual({ updatedCount: 0 });
  //   });
  // });
  //
  // describe('#updateOne', () => {
  //   it('call getOne and then remove the entity', async () => {
  //     const entity = testEntities()[0];
  //     const updateId = entity.testEntityPk;
  //     const update = { stringType: 'baz' };
  //     const savedEntity = plainToClass(TestEntity, { ...entity, ...update });
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.target).thenReturn(TestEntity);
  //     when(mockRepo.findOneOrFail(updateId)).thenResolve(entity);
  //     when(mockRepo.merge(entity, update)).thenReturn(savedEntity);
  //     when(mockRepo.save(deepEqual(savedEntity))).thenResolve(savedEntity);
  //     const queryResult = await queryService.updateOne(updateId, update);
  //     expect(queryResult).toEqual(savedEntity);
  //   });
  //
  //   it('call fail if the entity is not found', async () => {
  //     const entity = testEntities()[0];
  //     const updateId = entity.testEntityPk;
  //     const update = { stringType: 'baz' };
  //     const err = new Error('not found');
  //     const { queryService, mockRepo } = createQueryService();
  //     when(mockRepo.findOneOrFail(updateId)).thenReject(err);
  //     return expect(queryService.updateOne(updateId, update)).rejects.toThrowError(err);
  //   });
  // });
});
