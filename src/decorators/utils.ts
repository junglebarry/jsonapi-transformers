import { JsonapiEntity } from "../jsonapi/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function getEntityPrototypeChain(targetType: any): any[] {
  const proto = Object.getPrototypeOf(targetType);

  if (proto.prototype instanceof JsonapiEntity) {
    return [...getEntityPrototypeChain(proto), targetType];
  }
  return [targetType];
}
