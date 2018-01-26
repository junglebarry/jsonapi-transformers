import {
  ResourceIdentifier,
} from '../jsonapi';

export interface ResourceIdentifierConstructor {
  new (): ResourceIdentifier
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
export function entity(options: EntityOptions) {
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
