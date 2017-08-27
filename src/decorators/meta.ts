import {
  MetadataMap,
} from './metadata-map';

const META_PROPERTIES_MAP = new MetadataMap<MetaOptions>();

export interface MetaOptions {
  name?: string;
}

export function meta(options?: MetaOptions): PropertyDecorator {
  const opts = options || {};
  return (target: any, key: string) => {
    META_PROPERTIES_MAP.setMetadataByType(target.constructor.name, key, Object.assign({
      name: key,
    }, opts));
  }
}

export type MetaMetadata = { [name: string]: MetaOptions };

export function getMetaMetadata(target: any): MetaMetadata {
  return META_PROPERTIES_MAP.getMetadataByType(target.name);
}
