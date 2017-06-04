import {
  attribute,
  entity,
  fromJsonApiTopLevel,
  relationship,
  JsonapiEntity,
} from '../../src';

import { FAKE_JSON } from './fake-response';

@entity({ type: 'sections' })
class Section extends JsonapiEntity {
  @attribute() description?: string;
  @attribute() title: string;
  @relationship() children?: Section[];
}

@entity({ type: 'lists' })
class List extends JsonapiEntity {
  @attribute() date_created?: string;
  @attribute() description?: string;
  @attribute() last_published?: string;
  @attribute() last_updated?: string;
  @attribute() title: string;
  @attribute() published_status: string;
  @relationship() owner?: Agent;
  @relationship() sections?: Section[];
}

@entity({ type: 'items' })
class Item extends JsonapiEntity {
  @attribute() citation: string;
  @relationship() container?: List | Section;
  @relationship() list: List;
}

@entity({ type: 'agents' })
class Agent extends JsonapiEntity {
  @attribute({ name: 'first_name' }) firstName: string;
  @attribute() surname: string;

  /**
   * Compute the full name from first and surname.
   *
   * A trivial example of a derived property relying upon deserialisation.
   */
  get fullName() {
    return `${this.firstName} ${this.surname}`;
  }
}

describe('deserialisers', () => {
  describe('fromJsonApiTopLevel', () => {
    describe('JSON API top-level array deserialisation', () => {
      const FAKE_JSON_DESERIALISED: Item[] = fromJsonApiTopLevel(FAKE_JSON);

      it('should deserialise entries from the array, populating object properties', () => {
        const [item1] = FAKE_JSON_DESERIALISED;
        expect(item1).toBeDefined();
        expect(item1.citation).toEqual('<div data-item-id="ITEM-1" class="csl-entry">K. R. M. Short (1979) <i>The dynamite war</i>. Atlantic Highlands, N.J: Humanities Press.</div>');
      });

      it('should deserialise related objects, populating their properties', () => {
        const { list } = FAKE_JSON_DESERIALISED[0];
        expect(list.title).toBeDefined();
        expect(list.title).toEqual('Invision Mirror list');
      });

      it('should recursively deserialise related objects, populating their properties', () => {
        const { list } = FAKE_JSON_DESERIALISED[0];
        expect(list.owner).toBeDefined();
        expect(list.owner.surname).toEqual('Brooks');
      });

      it('should recursively deserialise related objects, populating renamed properties', () => {
        const { list } = FAKE_JSON_DESERIALISED[0];
        expect(list.owner).toBeDefined();
        expect(list.owner.firstName).toEqual('David James');
      });

      it('should deserialise related objects, including computed properties', () => {
        const { list } = FAKE_JSON_DESERIALISED[0];
        expect(list.owner).toBeDefined();
        expect(list.owner.fullName).toEqual('David James Brooks');
      });
    });
  });
});
