import {
  isEmptyObject,
  isDefined,
  keyBy,
} from '../../src/serialisation/utils';

class TestObj {
  constructor(public foo?: number) {}
}

describe('utils', () => {

  describe('isEmptyObject', () => {
    it('should return `true` for an empty Object', () => {
      expect(isEmptyObject({})).toEqual(true);
    });

    it('should return `false` for non-empty Objects', () => {
      expect(isEmptyObject({ foo: 1 })).toEqual(false);
      expect(isEmptyObject(new TestObj(1))).toEqual(false);
    });

    it('should return `false` for subtypes of Objects, even when empty', () => {
      expect(isEmptyObject(new TestObj())).toEqual(false);
    });

    it('should return `false` for non-Objects', () => {
      expect(isEmptyObject('foo')).toEqual(false);
      expect(isEmptyObject('   ')).toEqual(false);
      expect(isEmptyObject('')).toEqual(false);
      expect(isEmptyObject(1)).toEqual(false);
      expect(isEmptyObject(0)).toEqual(false);
      expect(isEmptyObject(true)).toEqual(false);
      expect(isEmptyObject(false)).toEqual(false);
    });
  });

  describe('isDefined', () => {
    it('should return `true` for non-falsy values', () => {
      expect(isDefined({ foo: 1 })).toEqual(true);
      expect(isDefined(new TestObj(1))).toEqual(true);
      expect(isDefined([1])).toEqual(true);
      expect(isDefined('1')).toEqual(true);
      expect(isDefined(1)).toEqual(true);
      expect(isDefined(true)).toEqual(true);
    });

    it('should return `true` for falsy values with types', () => {
      expect(isDefined({})).toEqual(true);
      expect(isDefined(null)).toEqual(true);
      expect(isDefined(new TestObj())).toEqual(true);
      expect(isDefined([])).toEqual(true);
      expect(isDefined('  ')).toEqual(true);
      expect(isDefined('')).toEqual(true);
      expect(isDefined(0)).toEqual(true);
      expect(isDefined(false)).toEqual(true);
    });

    it('should return `false` for values without a defined type', () => {
      expect(isDefined(undefined)).toEqual(false);
    });
  });

  describe('keyBy', () => {
    it('should return an empty object when presented with an empty array', () => {
      expect(keyBy<number>([], (num: number) => num.toString())).toEqual({});
    });

    it('should return a valid keyed object when presented with a non-empty array', () => {
      expect(keyBy([1,2,3], (num: number) => num.toString())).toEqual({
        1: 1,
        2: 2,
        3: 3,
      });

      expect(keyBy(['foo', 'bar', 'oobaz'], (str: string) => str.charAt(0))).toEqual({
        f: 'foo',
        b: 'bar',
        o: 'oobaz',
      });
    });

    it('should return the last values in array-order, where key collisions occur', () => {
      expect(keyBy([1,2,3,4,5,6], (num: number) => (num % 2 === 0).toString())).toEqual({
        true: 6,
        false: 5,
      });

      expect(keyBy(['foo', 'bar', 'fubar'], (str: string) => str.charAt(0))).toEqual({
        f: 'fubar',
        b: 'bar',
      });
    });
  });

});
