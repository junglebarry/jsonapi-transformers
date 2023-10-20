import { MetadataMap } from "./metadata-map";
import { getEntityPrototypeChain } from "./utils";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, key: string) => {
    RELATIONSHIPS_MAP.setMetadataByType(target.constructor, key, {
      name: key,
      ...opts,
    });
  };
}

export type RelationshipMetadata = { [name: string]: RelationshipOptions };

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function getRelationshipMetadata(target: any): RelationshipMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) =>
      Object.assign(soFar, RELATIONSHIPS_MAP.getMetadataByType(prototype)),
    {},
  );
}
