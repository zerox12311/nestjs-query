import { mock, reset, instance, when, deepEqual } from 'ts-mockito';
import { QueryService, RelationQueryService } from '../../src';

describe('RelationQueryService', () => {
  const mockQueryService: QueryService<TestType> = mock<QueryService<TestType>>();
  const mockRelationService: QueryService<TestType> = mock<QueryService<TestType>>();
  const testRelationFn = jest.fn();

  class TestType {
    foo!: string;
  }

  const relations = {
    test: { service: instance(mockRelationService), query: testRelationFn },
  };

  afterEach(() => {
    reset(mockQueryService);
    reset(mockRelationService);
    jest.clearAllMocks();
  });

  const queryService: QueryService<TestType> = new RelationQueryService(instance(mockQueryService), relations);

  it('should set the underlying service to a NoOpQueryService if called without a query service', () => {
    return expect(new RelationQueryService(relations).query({})).rejects.toThrowError('query is not implemented');
  });

  it('should proxy to the underlying service when calling addRelations', () => {
    const relationName = 'test';
    const id = 1;
    const relationIds = [1, 2, 3];
    const result = { foo: 'bar' };
    when(mockQueryService.addRelations(relationName, id, relationIds)).thenResolve(result);
    return expect(queryService.addRelations(relationName, id, relationIds)).resolves.toBe(result);
  });

  it('should proxy to the underlying service when calling findRelation with one dto', async () => {
    const relationName = 'test';
    const dto = new TestType();
    const result = { foo: 'bar' };
    const query = {};
    testRelationFn.mockReturnValue(query);
    when(mockRelationService.query(deepEqual({ ...query, paging: { limit: 1 } }))).thenResolve([result]);
    await expect(queryService.findRelation(TestType, relationName, dto)).resolves.toBe(result);
    return expect(testRelationFn).toBeCalledWith(dto);
  });

  it('should call the relationService findRelation with multiple dtos', async () => {
    const relationName = 'test';
    const dtos = [new TestType()];
    const query = {};
    testRelationFn.mockReturnValue(query);
    const resultRelations = [{ foo: 'baz' }];
    const result = new Map([[dtos[0], resultRelations[0]]]);
    when(mockRelationService.query(deepEqual({ ...query, paging: { limit: 1 } }))).thenResolve(resultRelations);
    await expect(queryService.findRelation(TestType, relationName, dtos)).resolves.toEqual(result);
    return expect(testRelationFn).toBeCalledWith(dtos[0]);
  });

  it('should call the original service if the relation is not in this relation query service', async () => {
    const relationName = 'otherRelation';
    const dto = new TestType();
    const result = { foo: 'baz' };
    when(mockQueryService.findRelation(TestType, relationName, dto)).thenResolve(result);
    await expect(queryService.findRelation(TestType, relationName, dto)).resolves.toEqual(result);
    return expect(testRelationFn).not.toBeCalled();
  });

  it('should call the original service if the relation is not in this relation query service with multiple DTOs', async () => {
    const relationName = 'otherRelation';
    const dtos = [new TestType()];
    const result = new Map([[dtos[0], { foo: 'baz' }]]);
    when(mockQueryService.findRelation(TestType, relationName, dtos)).thenResolve(result);
    await expect(queryService.findRelation(TestType, relationName, dtos)).resolves.toEqual(result);
    return expect(testRelationFn).not.toBeCalled();
  });

  it('should proxy to the underlying service when calling queryRelations with one dto', async () => {
    const relationName = 'test';
    const dto = new TestType();
    const result = [{ foo: 'bar' }];
    const query = {};
    const relationQuery = {};
    testRelationFn.mockReturnValue(relationQuery);
    when(mockRelationService.query(deepEqual({ ...relationQuery }))).thenResolve(result);
    await expect(queryService.queryRelations(TestType, relationName, dto, query)).resolves.toBe(result);
    return expect(testRelationFn).toBeCalledWith(dto);
  });

  it('should proxy to the underlying service when calling queryRelations with many dtos', () => {
    const relationName = 'test';
    const dtos = [new TestType()];
    const query = {};
    const relationQuery = {};
    const relationResult: TestType[] = [];
    const result = new Map([[dtos[0], relationResult]]);
    testRelationFn.mockReturnValue(relationQuery);
    when(mockRelationService.query(deepEqual({ ...relationQuery }))).thenResolve(relationResult);
    return expect(queryService.queryRelations(TestType, relationName, dtos, query)).resolves.toEqual(result);
  });

  it('should proxy to the underlying service when calling queryRelations with one dto and a unknown relation', () => {
    const relationName = 'unknown';
    const dto = new TestType();
    const query = {};
    const result = [{ foo: 'bar' }];
    when(mockQueryService.queryRelations(TestType, relationName, dto, query)).thenResolve(result);
    return expect(queryService.queryRelations(TestType, relationName, dto, query)).resolves.toBe(result);
  });

  it('should proxy to the underlying service when calling queryRelations with many dtos and a unknown relation', () => {
    const relationName = 'unknown';
    const dtos = [new TestType()];
    const query = {};
    const result = new Map([[{ foo: 'bar' }, []]]);
    when(mockQueryService.queryRelations(TestType, relationName, dtos, query)).thenResolve(result);
    return expect(queryService.queryRelations(TestType, relationName, dtos, query)).resolves.toBe(result);
  });

  it('should proxy to the underlying service when calling removeRelation', () => {
    const relationName = 'test';
    const id = 1;
    const relationId = 2;
    const result = { foo: 'bar' };
    when(mockQueryService.removeRelation(relationName, id, relationId)).thenResolve(result);
    return expect(queryService.removeRelation(relationName, id, relationId)).resolves.toBe(result);
  });
  it('should proxy to the underlying service when calling removeRelations', () => {
    const relationName = 'test';
    const id = 1;
    const relationIds = [2];
    const result = { foo: 'bar' };
    when(mockQueryService.removeRelations(relationName, id, relationIds)).thenResolve(result);
    return expect(queryService.removeRelations(relationName, id, relationIds)).resolves.toBe(result);
  });
  it('should proxy to the underlying service when calling setRelation', () => {
    const relationName = 'test';
    const id = 1;
    const relationId = 2;
    const result = { foo: 'bar' };
    when(mockQueryService.setRelation(relationName, id, relationId)).thenResolve(result);
    return expect(queryService.setRelation(relationName, id, relationId)).resolves.toBe(result);
  });
});
