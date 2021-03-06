import { Class } from '@nestjs-query/core';
import { Parent, Context, ArgsType, Resolver, Args } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { getDTONames } from '../../common';
import { ResolverField } from '../../decorators';
import { FindRelationsLoader, DataLoaderFactory, QueryRelationsLoader } from '../../loader';
import { ConnectionType, QueryArgsType } from '../../types';
import { transformAndValidate } from '../helpers';
import { ServiceResolver, BaseServiceResolver } from '../resolver.interface';
import { flattenRelations, removeRelationOpts } from './helpers';
import { RelationsOpts, ResolverRelation } from './relations.interface';

const ReadOneRelationMixin = <DTO, Relation>(DTOClass: Class<DTO>, relation: ResolverRelation<Relation>) => <
  B extends Class<ServiceResolver<DTO>>
>(
  Base: B,
): B => {
  if (relation.disableRead) {
    return Base;
  }
  const commonResolverOpts = removeRelationOpts(relation);
  const relationDTO = relation.DTO;
  const { baseNameLower, baseName } = getDTONames(relationDTO, { dtoName: relation.dtoName });
  const relationName = relation.relationName ?? baseNameLower;
  const loaderName = `load${baseName}For${DTOClass.name}`;
  const findLoader = new FindRelationsLoader<DTO, Relation>(relationDTO, relationName);

  @Resolver(() => DTOClass, { isAbstract: true })
  class ReadOneMixin extends Base {
    @ResolverField(baseNameLower, () => relationDTO, { nullable: relation.nullable }, commonResolverOpts)
    [`find${baseName}`](@Parent() dto: DTO, @Context() context: ExecutionContext): Promise<Relation | undefined> {
      return DataLoaderFactory.getOrCreateLoader(context, loaderName, findLoader.createLoader(this.service)).load(dto);
    }
  }
  return ReadOneMixin;
};

const ReadManyRelationMixin = <DTO, Relation>(DTOClass: Class<DTO>, relation: ResolverRelation<Relation>) => <
  B extends Class<ServiceResolver<DTO>>
>(
  Base: B,
): B => {
  if (relation.disableRead) {
    return Base;
  }
  const commonResolverOpts = removeRelationOpts(relation);
  const relationDTO = relation.DTO;
  const { pluralBaseNameLower, pluralBaseName } = getDTONames(relationDTO, { dtoName: relation.dtoName });
  const relationName = relation.relationName ?? pluralBaseNameLower;
  const loaderName = `load${pluralBaseName}For${DTOClass.name}`;
  const queryLoader = new QueryRelationsLoader<DTO, Relation>(relationDTO, relationName);
  @ArgsType()
  class RelationQA extends QueryArgsType(relationDTO) {}

  const CT = ConnectionType(relationDTO);
  @Resolver(() => DTOClass, { isAbstract: true })
  class ReadManyMixin extends Base {
    @ResolverField(pluralBaseNameLower, () => CT, { nullable: relation.nullable }, commonResolverOpts)
    async [`query${pluralBaseName}`](
      @Parent() dto: DTO,
      @Args() q: RelationQA,
      @Context() context: ExecutionContext,
    ): Promise<ConnectionType<Relation>> {
      const qa = await transformAndValidate(RelationQA, q);
      const loader = DataLoaderFactory.getOrCreateLoader(context, loaderName, queryLoader.createLoader(this.service));
      return CT.createFromPromise(loader.load({ dto, query: qa }), qa.paging || {});
    }
  }
  return ReadManyMixin;
};

export const ReadRelationsMixin = <DTO>(DTOClass: Class<DTO>, relations: RelationsOpts) => <
  B extends Class<ServiceResolver<DTO>>
>(
  Base: B,
): B => {
  const manyRelations = flattenRelations(relations.many ?? {});
  const oneRelations = flattenRelations(relations.one ?? {});
  const WithMany = manyRelations.reduce((RB, a) => ReadManyRelationMixin(DTOClass, a)(RB), Base);
  return oneRelations.reduce((RB, a) => ReadOneRelationMixin(DTOClass, a)(RB), WithMany);
};

export const ReadRelationsResolver = <DTO>(
  DTOClass: Class<DTO>,
  relations: RelationsOpts,
): Class<ServiceResolver<DTO>> => {
  return ReadRelationsMixin(DTOClass, relations)(BaseServiceResolver);
};
