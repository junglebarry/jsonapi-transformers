import {
  MetadataMap,
} from './metadata-map';

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
  return RELATIONSHIPS_MAP.getMetadataByType(target.name);
}
