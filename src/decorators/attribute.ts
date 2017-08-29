import {
  MetadataMap,
} from './metadata-map';

const ATTRIBUTES_MAP = new MetadataMap<AttributeOptions>();

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

export type AttributeMetadata = { [name: string]: AttributeOptions };

export function getAttributeMetadata(target: any): AttributeMetadata {
  return ATTRIBUTES_MAP.getMetadataByType(target.name);
}
