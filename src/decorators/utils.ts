import { JsonapiEntity } from "../jsonapi";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface JsonapiEntityConstructorType<T extends JsonapiEntity<T>>
  extends Type<T> {
  new (properties: Partial<T>): T;
}

export function getEntityPrototypeChain<T extends JsonapiEntity<T>>(
  targetType: JsonapiEntityConstructorType<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): JsonapiEntityConstructorType<any>[] {
  return getFullPrototypeChain(targetType).filter(
    (e) => e.prototype instanceof JsonapiEntity
  );
}

export function getFullPrototypeChain(targetType: Type): Type[] {
  return getPrototypeChain(targetType, []);
}

function getPrototypeChain(targetType: Type, soFar = []): Type[] {
  if (!targetType || soFar.includes(targetType)) {
    return soFar;
  }
  return getPrototypeChain(Object.getPrototypeOf(targetType), [
    ...soFar,
    targetType,
  ]);
}

export function entityConstructor<T extends JsonapiEntity<T>>(
  entity: T
): JsonapiEntityConstructorType<T> {
  return entity.constructor as JsonapiEntityConstructorType<T>;
}
