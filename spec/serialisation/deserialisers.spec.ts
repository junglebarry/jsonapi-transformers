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
import { FAKE_MULTIPLE_RESPONSE } from './fake-multiple-response.json';

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

      it('should deserialise related object arrays with the same type but different name, populating their properties', () => {
        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(2);

        const [oldAddress1, oldAddress2] = PERSON_1.oldAddresses;
        expect(oldAddress1).toEqual(jasmine.any(Address));
        expect(oldAddress1.houseNumber).toEqual(1007);
        expect(oldAddress1.street).toEqual("Mountain Drive");
        expect(oldAddress1.city).toEqual("Gotham City");

        expect(oldAddress2).toEqual(jasmine.any(Address));
        expect(oldAddress2.houseNumber).toEqual(29);
        expect(oldAddress2.street).toEqual("Acacia Road");
        expect(oldAddress2.city).toEqual("Nuttytown");
      });

      it('should recursively deserialise related objects, populating their properties', () => {
        // traverse one level
        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(2);
        const [oldAddress1, oldAddress2] = PERSON_1.oldAddresses;
        expect(oldAddress1).toEqual(jasmine.any(Address));
        expect(oldAddress2).toEqual(jasmine.any(Address));

        // traverse two levels
        const { mostFamousInhabitant } = oldAddress1;
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

    describe('JSON API top-level datum deserialisation', () => {
      const { deserialised, referents } = fromJsonApiTopLevel(FAKE_MULTIPLE_RESPONSE)
      const PEOPLE: Person[] = deserialised;

      it('should deserialise each item in the top-level data from the response', () => {
        expect(PEOPLE).toEqual(jasmine.any(Array));
        expect(PEOPLE.length).toEqual(2);

        const [PERSON_1, PERSON_2] = PEOPLE;

        expect(PERSON_1).toEqual(jasmine.any(Person));
        expect(PERSON_2).toEqual(jasmine.any(Person));
      });

      it('should deserialise the top-level data from the response, populating object attributes', () => {
        const [PERSON_1] = PEOPLE;

        const { id, type, firstName, surname } = PERSON_1;

        expect(id).toEqual('person1');
        expect(type).toEqual('people');
        expect(firstName).toEqual('Eric');
        expect(surname).toEqual('Wimp');
      });

      it('should deserialise related objects, populating their properties', () => {
        const [PERSON_1] = PEOPLE;

        expect(PERSON_1.address).toEqual(jasmine.any(Address));
        const { houseNumber, street, city } = PERSON_1.address;
        expect(houseNumber).toEqual(29);
        expect(street).toEqual("Acacia Road");
        expect(city).toEqual("Nuttytown");
      });

      it('should deserialise related objects with the same type but different name, populating their properties', () => {
        const [PERSON_1] = PEOPLE;

        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(2);

        const [oldAddress1, oldAddress2] = PERSON_1.oldAddresses;
        expect(oldAddress1).toEqual(jasmine.any(Address));
        expect(oldAddress1.houseNumber).toEqual(1007);
        expect(oldAddress1.street).toEqual("Mountain Drive");
        expect(oldAddress1.city).toEqual("Gotham City");

        expect(oldAddress2).toEqual(jasmine.any(Address));
        expect(oldAddress2.houseNumber).toEqual(29);
        expect(oldAddress2.street).toEqual("Acacia Road");
        expect(oldAddress2.city).toEqual("Nuttytown");
      });

      it('should recursively deserialise related objects, populating their properties', () => {
        const [PERSON_1] = PEOPLE;

        // traverse one level
        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(2);
        const [oldAddress1, oldAddress2] = PERSON_1.oldAddresses;
        expect(oldAddress1).toEqual(jasmine.any(Address));
        expect(oldAddress2).toEqual(jasmine.any(Address));

        // traverse two levels
        const { mostFamousInhabitant } = oldAddress1;
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
