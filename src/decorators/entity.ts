import { ResourceIdentifier } from "../jsonapi";

export interface ResourceIdentifierConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): ResourceIdentifier;
}

export class TypeMap {
  private constructorsByJsonapiType: {
    [typeName: string]: ResourceIdentifierConstructor;
  } = {};

  get(typeName: string): ResourceIdentifierConstructor {
    return this.constructorsByJsonapiType[typeName];
  }

  set(typeName: string, constructorType: ResourceIdentifierConstructor): void {
    this.constructorsByJsonapiType[typeName] = constructorType;
  }

  remove(typeName: string, ...typeNames: string[]): void {
    [typeName, ...typeNames].forEach((someType) => {
      delete this.constructorsByJsonapiType[someType];
    });
  }
}

export const ENTITIES_MAP = new TypeMap();

export function getClassForJsonapiType(
  type: string,
): ResourceIdentifierConstructor {
  return ENTITIES_MAP.get(type);
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function getConstructorForJsonapiType(type: string): Function {
  const clazz = getClassForJsonapiType(type);
  return clazz && clazz.prototype && clazz.prototype.constructor;
}

export interface EntityOptions {
  type: string;
}

export function registerEntityConstructorForType(
  constructor: ResourceIdentifierConstructor,
  type: string,
): boolean {
  const existingConstructor = ENTITIES_MAP.get(type);
  if (!existingConstructor) {
    ENTITIES_MAP.set(type, constructor);
    return true;
  } else if (existingConstructor === constructor) {
    return false;
  }

  throw new Error(
    `Attempt to reregister JSON:API type '${type}' to the entity constructor type: ${constructor.name}`,
  );
}

export function isEntityConstructorRegistered(
  constructor: ResourceIdentifierConstructor,
): boolean {
  const instance = new constructor();
  return ENTITIES_MAP.get(instance.type) ? true : false;
}

/**
 * Annotates a class to indicate that it is a JSON:API entity definition.
 *
 * Any class annotated with `@entity` should be considered serialisable to JSON:API,
 * and should have `@attribute` and `@relationship` decorators to indicate properties
 * to be serialisable to and deserialisable from appropriate JSON:API data.
 *
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- constructor types cannot be known */
export function entity(
  options: EntityOptions,
): (ResourceIdentifierConstructor) => any {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const { type } = options;

  return (original: ResourceIdentifierConstructor) => {
    original.prototype.type = type;
    // add the type to the reverse lookup for deserialisation
    registerEntityConstructorForType(original, type);
    return original;
  };
}
