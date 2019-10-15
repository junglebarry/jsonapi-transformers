import {
  ResourceIdentifier,
} from '../jsonapi';

export interface ResourceIdentifierConstructor {
  new (...args:any[]): ResourceIdentifier
}

export class TypeMap {
  private constructorsByJsonapiType: { [typeName: string]: ResourceIdentifierConstructor } = {};

  get(typeName: string): ResourceIdentifierConstructor {
    return this.constructorsByJsonapiType[typeName];
  }

  set(typeName: string, constructorType: ResourceIdentifierConstructor): void {
    this.constructorsByJsonapiType[typeName] = constructorType;
  }
}

export const ENTITIES_MAP = new TypeMap();

export function getClassForJsonapiType(type: string): ResourceIdentifierConstructor {
  return ENTITIES_MAP.get(type);
}

export function getConstructorForJsonapiType(type: string): Function {
  const clazz = getClassForJsonapiType(type);
  return clazz && clazz.prototype && clazz.prototype.constructor;
}

export interface EntityOptions {
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
export function entity<E extends ResourceIdentifierConstructor>(options: EntityOptions): (E) => typeof E {
  const { type } = options;

  return (constructor: ResourceIdentifierConstructor) => {
    const clazz = class CustomJsonapiEntity extends constructor {
      type = type;
    };
    ENTITIES_MAP.set(type, clazz);
    return clazz;
  }
}