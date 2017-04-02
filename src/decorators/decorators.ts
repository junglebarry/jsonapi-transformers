type MetadataByPropertyName<T> = { [attributeName: string]: T };
type PropertyTypesForType<T> = { [typeName: string]: MetadataByPropertyName<T> };

class MetadataMap<T> {
  private metadataByType: PropertyTypesForType<T> = {};

  getMetadataByType(typeName: string): MetadataByPropertyName<T> {
    return this.metadataByType[typeName] || {};
  }

  setMetadataByType(typeName: string, keyName: string, metadata: T): void {
    this.metadataByType[typeName] = Object.assign({}, this.getMetadataByType(typeName), {
      [keyName]: metadata,
    });
  }
}

export const ATTRIBUTES_MAP = new MetadataMap<AttributeOptions>();
export const RELATIONSHIPS_MAP = new MetadataMap<RelationshipOptions>();

export interface AttributeOptions {
  name?: string;
}

export function attribute(options?: AttributeOptions): PropertyDecorator {
  const opts = options || {};
  return (target: any, key: string) => {
    ATTRIBUTES_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
      name: key,
    }, opts));
  }
}

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

export type AttributeMetadata = { [name: string]: AttributeOptions };

export function getAttributeMetadata(target: any): AttributeMetadata {
  return ATTRIBUTES_MAP.getMetadataByType(target.name);
}

export type RelationshipMetadata = { [name: string]: RelationshipOptions };

export function getRelationshipMetadata(target: any): RelationshipMetadata {
  return RELATIONSHIPS_MAP.getMetadataByType(target.name);
}
