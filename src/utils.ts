export function keyBy<T, K>(array: T[], keyFunc: (T) => string): { [key: string]: T } {
  const reducer = (soFar, element) => Object.assign(soFar, {
    [keyFunc(element)]: element,
  });
  return array.reduce(reducer,{});
}

export function isEmptyObject(obj: any): boolean {
  return (Object.keys(obj).length === 0) && (obj.constructor === Object)
}
