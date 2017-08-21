import {
  attribute,
  entity,
  fromJsonApiTopLevel,
  relationship,
  JsonapiEntity,
} from '../../src';

import {
  Address,
  Person,
} from '../test-data';

import { FAKE_SINGLE_RESPONSE } from './fake-single-response.json';

describe('deserialisers', () => {
  describe('fromJsonApiTopLevel', () => {
    describe('JSON API top-level datum deserialisation', () => {
      const { deserialised, referents } = fromJsonApiTopLevel(FAKE_SINGLE_RESPONSE)
      const PERSON_1: Person = deserialised;

      it('should deserialise the top-level datum from the response, populating object attributes', () => {
        expect(PERSON_1).toEqual(jasmine.any(Person));
        const { id, type, firstName, surname } = PERSON_1;
        expect(id).toEqual('person1');
        expect(type).toEqual('people');
        expect(firstName).toEqual('Eric');
        expect(surname).toEqual('Wimp');
      });

      it('should deserialise related objects, populating their properties', () => {
        expect(PERSON_1.address).toEqual(jasmine.any(Address));
        const { houseNumber, street, city } = PERSON_1.address;
        expect(houseNumber).toEqual(29);
        expect(street).toEqual("Acacia Road");
        expect(city).toEqual("Nuttytown");
      });

      it('should deserialise related objects with the same type but different name, populating their properties', () => {
        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(1);
        const [oldAddress] = PERSON_1.oldAddresses;
        expect(oldAddress).toEqual(jasmine.any(Address));
        expect(oldAddress.houseNumber).toEqual(1007);
        expect(oldAddress.street).toEqual("Mountain Drive");
        expect(oldAddress.city).toEqual("Gotham City");
      });

      it('should recursively deserialise related objects, populating their properties', () => {
        // traverse one level
        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(1);
        const [oldAddress] = PERSON_1.oldAddresses;

        // traverse two levels
        const { mostFamousInhabitant } = oldAddress;
        expect(mostFamousInhabitant).toEqual(jasmine.any(Person));
        expect(mostFamousInhabitant.id).toEqual('person2');
        expect(mostFamousInhabitant.type).toEqual('people');
        expect(mostFamousInhabitant.firstName).toEqual('Bruce');
        expect(mostFamousInhabitant.surname).toEqual('Wayne');

        // traverse three levels
        expect(mostFamousInhabitant.address).toEqual(jasmine.any(Address));
        const { address } = mostFamousInhabitant;
        expect(address.houseNumber).toEqual(1007);
        expect(address.street).toEqual("Mountain Drive");
        expect(address.city).toEqual("Gotham City");
      });
    });
  });
});
