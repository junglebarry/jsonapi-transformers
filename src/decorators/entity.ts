import {
  JsonapiEntity,
} from '../jsonapi';

export interface JsonapiEntityConstructor {
  new (): JsonapiEntity
}

export class TypeMap {
  private constructorsByJsonapiType: { [typeName: string]: JsonapiEntityConstructor } = {};

  get(typeName: string): JsonapiEntityConstructor {
    return this.constructorsByJsonapiType[typeName];
  }

  set(typeName: string, constructorType: JsonapiEntityConstructor): void {
    this.constructorsByJsonapiType[typeName] = constructorType;
  }
}

export const ENTITIES_MAP = new TypeMap();

export function getClassForJsonapiType(type: string): JsonapiEntityConstructor {
  return ENTITIES_MAP.get(type);
}

export function getConstructorForJsonapiType(type: string): Function {
  const clazz = getClassForJsonapiType(type);
  return clazz && clazz.prototype && clazz.prototype.constructor;
}

export interface EntityOptions {}

/**
 * Annotates a class to indicate that it is a JSON:API entity definition.
 *
 * Any class annotated with `@entity` should be considered serialisable to JSON:API,
 * and should have `@attribute` and `@relationship` decorators to indicate properties
 * to be serialisable to and deserialisable from appropriate JSON:API data.
 *
 */
export function entity(options: EntityOptions = {}) {
  return (constructor: JsonapiEntityConstructor) => {
    const exemplar = new constructor();
    const original = constructor;

    // a utility function to generate instances of a class
    const construct = (constructorFunc: JsonapiEntityConstructor, args) => {
      const constructorClosure : any = function () {
        return constructorFunc.apply(this, args);
      }
      constructorClosure.prototype = constructorFunc.prototype;

      // construct an instance and bind "type" correctly
      return new constructorClosure()
    };

    // the new constructor behaviour
    const wrappedConstructor : any = (...args) => construct(original, args);

    // copy prototype so intanceof operator still works
    wrappedConstructor.prototype = original.prototype;

    // add the type to the reverse lookup for deserialisation
    ENTITIES_MAP.set(exemplar.type, wrappedConstructor);

    // return new constructor (will override original)
    return wrappedConstructor;
  }
}
