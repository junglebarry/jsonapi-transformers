import {
  isUnresolvedIdentifier,
  unresolvedIdentifier,
  JsonapiEntity,
  ResourceIdentifier,
  UnresolvedResourceIdentifier,
} from '../../src';

describe('unresolved-identifiers', () => {

  class FakeJsonapiEntity extends JsonapiEntity {
    id = 'foo';
    type = 'things';
  }

  describe('isUnresolvedIdentifier', () => {
    it('should return true for a valid UnresolvedResourceIdentifier', () => {
      expect(isUnresolvedIdentifier(new UnresolvedResourceIdentifier('foo', 'things'))).toEqual(true);
    });

    it('should return false for other subtypes of ResourceIdentifier', () => {
      expect(isUnresolvedIdentifier({ id: 'foo', type: 'things' })).toEqual(false);
      expect(isUnresolvedIdentifier(new FakeJsonapiEntity())).toEqual(false);
    });
  });
});
