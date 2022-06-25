import { JsonapiEntity } from "../jsonapi";
import { JsonapiEntityConstructorType, getFullPrototypeChain } from "./utils";

export class TypeMap {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private constructorsByJsonapiType: {
    [typeName: string]: JsonapiEntityConstructorType<any>;
  } = {};
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(typeName: string): JsonapiEntityConstructorType<any> {
    return this.constructorsByJsonapiType[typeName];
  }

  set<T extends JsonapiEntity<T>>(
    typeName: string,
    constructorType: JsonapiEntityConstructorType<T>
  ): void {
    this.constructorsByJsonapiType[typeName] = constructorType;
  }

  remove(typeName: string, ...typeNames: string[]): void {
    [typeName, ...typeNames].forEach((someType) => {
      delete this.constructorsByJsonapiType[someType];
    });
  }
}

export const ENTITIES_MAP = new TypeMap();

export function getConstructorForJsonapiType(
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): JsonapiEntityConstructorType<JsonapiEntity<any>> {
  return ENTITIES_MAP.get(type);
}

export interface EntityOptions {
  type: string;
}

export function registerEntityConstructorForType<T extends JsonapiEntity<T>>(
  constructor: JsonapiEntityConstructorType<T>,
  type: string
): boolean {
  const existingConstructor = ENTITIES_MAP.get(type);
  if (!existingConstructor) {
    ENTITIES_MAP.set(type, constructor);
    return true;
  } else if (existingConstructor === constructor) {
    return false;
  }

  throw new Error(
    `Attempt to reregister JSON:API type '${type}' to the entity constructor type: ${constructor.name}`
  );
}

export function isEntityConstructorRegistered<T extends JsonapiEntity<T>>(
  constructor: JsonapiEntityConstructorType<T>
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
 */
export function entity(
  options: EntityOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (c: JsonapiEntityConstructorType<any>) => JsonapiEntityConstructorType<any> {
  const { type } = options;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    original: JsonapiEntityConstructorType<any>
  ): JsonapiEntityConstructorType<any> => {
    const chain = getFullPrototypeChain(original);
    if (!chain.includes(JsonapiEntity)) {
      throw new Error(
        "`@entity` must only be applied to `JsonapiEntity` subtypes"
      );
    }

    // initialises the readonly property `type` for all instances of the constructor
    original.prototype.type = type;

    // add the type to the reverse lookup for deserialisation
    registerEntityConstructorForType(original, type);

    return original;
  };
}
