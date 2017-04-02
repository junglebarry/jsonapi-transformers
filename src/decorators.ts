import {
  ResourceIdentifier,
} from './jsonapi';

interface ResourceIdentifierConstructor {
  new (): ResourceIdentifier
}

class TypeMap {
  private constructorsByJsonapiType: { [typeName: string]: ResourceIdentifierConstructor } = {};

  get(typeName: string): ResourceIdentifierConstructor {
    return this.constructorsByJsonapiType[typeName];
  }

  set(typeName: string, constructorType: ResourceIdentifierConstructor): void {
    this.constructorsByJsonapiType[typeName] = constructorType;
  }
}

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

export const ENTITIES_MAP = new TypeMap();
export const ATTRIBUTES_MAP = new MetadataMap<AttributeOptions>();
export const RELATIONSHIPS_MAP = new MetadataMap<RelationshipOptions>();

export function getClassForJsonapiType(type: string): ResourceIdentifierConstructor {
  return ENTITIES_MAP.get(type);
}

export function getConstructorForJsonapiType(type: string): Function {
  const clazz = getClassForJsonapiType(type);
  return clazz && clazz.prototype && clazz.prototype.constructor;
}

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

interface EntityOptions {
  type: string
}

/**
 * Annotates a class to indicate that it is a JSON:API entity definition.
 *
 * Any class annotated with `@entity` should be considered serialisable to JSON:API,
 * and should have `@attribute` and `@relationship` decorators to indicate properties
 * to be serialisable to and deserialisable from appropriate JSON:API data.
 *
 */
export function entity(options: EntityOptions): ClassDecorator {
  const { type } = options;

  return (constructor: ResourceIdentifierConstructor) => {

    const original = constructor;

    // a utility function to generate instances of a class
    const construct = (constructorFunc: ResourceIdentifierConstructor, args) => {
      const constructorClosure : any = function () {
        return constructorFunc.apply(this, args);
      }
      constructorClosure.prototype = constructorFunc.prototype;

      // construct an instance and bind "type" correctly
      const instance = new constructorClosure();
      instance.type = type;
      return instance;
    };

    // the new constructor behaviour
    const wrappedConstructor : any = (...args) => construct(original, args);

    // copy prototype so intanceof operator still works
    wrappedConstructor.prototype = original.prototype;

    // add the type to the reverse lookup for deserialisation
    ENTITIES_MAP.set(type, wrappedConstructor);

    // return new constructor (will override original)
    return wrappedConstructor;
  }
}
