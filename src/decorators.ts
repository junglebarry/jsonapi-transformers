import {
  ResourceObject,
} from './jsonapi-types';

interface ResourceObjectConstructor {
  new (): ResourceObject
}

class TypeMap {
  private constructorsByJsonapiType: { [typeName: string]: any } = {};

  get(typeName: string): any {
    return this.constructorsByJsonapiType[typeName];
  }

  set(typeName: string, constructorType: any): void {
    this.constructorsByJsonapiType[typeName] = constructorType;
  }
}

type TypeByPropertyName = { [attributeName: string]: true };
type PropertyTypesForType = { [typeName: string]: TypeByPropertyName };

class MetadataMap {
  private metadataByType: PropertyTypesForType = {};

  getMetadataByType(typeName: string): TypeByPropertyName {
    return this.metadataByType[typeName] || {};
  }

  setMetadataByType(typeName: string, keyName: string): void {
    this.metadataByType[typeName] = Object.assign({}, this.getMetadataByType(typeName), {
      [keyName]: true,
    });
  }
}

export const ENTITIES_MAP = new TypeMap();
export const ATTRIBUTES_MAP = new MetadataMap();
export const RELATIONSHIPS_MAP = new MetadataMap();

export function getClassForJsonapiType(type: string): any {
  return ENTITIES_MAP.get(type);
}

export function getConstructorForJsonapiType(type: string): any {
  const clazz = getClassForJsonapiType(type);
  return clazz && clazz.prototype && clazz.prototype.constructor;
}

export function attribute(target: any, key: string) {
  ATTRIBUTES_MAP.setMetadataByType(target.constructor.name, key);
}

export function relationship(target : any, key: string) {
  RELATIONSHIPS_MAP.setMetadataByType(target.constructor.name, key);
}

export function getAttributeNames(target: any) {
  const metadataByType = ATTRIBUTES_MAP.getMetadataByType(target.name);
  return Object.keys(metadataByType);
}

export function getRelationshipNames(target: any) {
  const metadataByType = RELATIONSHIPS_MAP.getMetadataByType(target.name);
  return Object.keys(metadataByType);
}

export function entity({ type }) {
  return (constructor: ResourceObjectConstructor) => {

    const original = constructor;

    // a utility function to generate instances of a class
    const construct = (constructorFunc, args) => {
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
