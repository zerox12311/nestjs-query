import { QueryService } from '@nestjs-query/core';
import * as nestjsCommon from '@nestjs/common';
import { getTypeOrmQueryServiceKey, InjectTypeOrmQueryService } from '../../src/decorators';

describe('@InjectTypeOrmQueryService', () => {
  const injectSpy = jest.spyOn(nestjsCommon, 'Inject');

  class TestEntity {}

  it('call inject witht the correct key', () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class Test {
      constructor(@InjectTypeOrmQueryService(TestEntity) readonly service: QueryService<TestEntity>) {}
    }
    expect(injectSpy).toBeCalledTimes(1);
    expect(injectSpy).toBeCalledWith(getTypeOrmQueryServiceKey(TestEntity));
  });
});
