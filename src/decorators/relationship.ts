import {
  MetadataMap,
} from './metadata-map';

import { getEntityPrototypeChain } from './utils';

const RELATIONSHIPS_MAP = new MetadataMap<RelationshipOptions>();

export interface RelationshipOptions {
  allowUnresolvedIdentifiers?: boolean;
  name?: string;
}

const DefaultRelationshipOptions: RelationshipOptions = {
  allowUnresolvedIdentifiers: false,
};

export function relationship(options?: RelationshipOptions): PropertyDecorator {
  const opts = Object.assign({}, DefaultRelationshipOptions, options || {});
  return (target : any, key: string) => {
    RELATIONSHIPS_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
      name: key,
    }, opts));
  }
}

export type RelationshipMetadata = { [name: string]: RelationshipOptions };

export function getRelationshipMetadata(target: any): RelationshipMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) => Object.assign(soFar, RELATIONSHIPS_MAP.getMetadataByType(prototype.name)),
    {}
  );
}
