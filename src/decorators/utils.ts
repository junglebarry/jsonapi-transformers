import { JsonapiEntity } from '../jsonapi';


export function getEntityPrototypeChain(targetType: any): any[] {
  const proto = Object.getPrototypeOf(targetType);

  if (proto.prototype instanceof JsonapiEntity) {
    return [...getEntityPrototypeChain(proto), targetType];
  }
  return [targetType];
}
