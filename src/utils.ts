
export function isEmptyObject(obj: any): boolean {
  return (Object.keys(obj).length === 0) && (obj.constructor === Object)
}

export function isDefined(value: any): boolean {
  return typeof value !== 'undefined';
}

export function keyBy<T>(array: T[], keyFunc: (T) => string): { [key: string]: T } {
  const reducer = (soFar, element) => Object.assign(soFar, {
    [keyFunc(element)]: element,
  });
  return array.reduce(reducer, {});
}
