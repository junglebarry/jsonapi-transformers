import {
  byTypeAndId,
  fromJsonApiResourceObject,
  jsonapiIdentifier,
  toJsonApi,
} from '../src';

import {
  Address,
  Person,
} from './test-data';

const address1: Address = new Address();
address1.id = 'address1';
address1.houseNumber = 8;
address1.street = 'Midland Road';
address1.city = 'Birmingham';
address1.county = 'West Midlands';

const address2: Address = new Address();
address2.id = 'address2';
address2.street = 'Clarence Road';
address2.city = 'Birmingham';

const person1: Person = new Person();
person1.id = 'person1';
person1.firstName = 'David';
person1.surname = 'Brooks';
person1.address = address1;
person1.old_addresses = [address2];


describe('serialisers', () => {

  describe('toJsonApi', () => {
    it('should serialise to JSON API including attributes', () => {
      expect(toJsonApi(address1)).toEqual({
        id: 'address1',
        type: 'addresses',
        attributes: {
          houseNumber: 8,
          street: 'Midland Road',
          city: 'Birmingham',
          county: 'West Midlands',
        },
      });

      expect(toJsonApi(address2)).toEqual({
        id: 'address2',
        type: 'addresses',
        attributes: {
          street: 'Clarence Road',
          city: 'Birmingham',
        },
      });
    });

    it('should serialise to JSON API including attributes and relationships', () => {
      expect(toJsonApi(person1)).toEqual({
        id: 'person1',
        type: 'people',
        attributes: {
          firstName: 'David',
          surname: 'Brooks',
        },
        relationships: {
          address: {
            data: {
              id: 'address1',
              type: 'addresses',
            },
          },
          old_addresses: {
            data: [
              {
                id: 'address2',
                type: 'addresses',
              },
            ],
          },
        },
      });
    });
  });

  describe('fromJsonApiResourceObject', () => {
    const address1Jsonapi = toJsonApi(address1);
    const address2Jsonapi = toJsonApi(address2);
    const person1Jsonapi = toJsonApi(person1);

    it('should deserialise an object without relationships', () => {
      const address1FromJsonapi: Address = fromJsonApiResourceObject(address1Jsonapi, {});
      expect(address1FromJsonapi).toEqual(jasmine.any(Address));
      expect(address1FromJsonapi).toEqual(address1);
    });

    it('should deserialise an object with unresolved relationships omitted', () => {
      const person1FromJsonapi: Person = fromJsonApiResourceObject(person1Jsonapi, {}, false);
      expect(person1FromJsonapi).toEqual(jasmine.any(Person));
      expect(person1FromJsonapi.id).toEqual('person1');
      expect(person1FromJsonapi.firstName).toEqual('David');
      expect(person1FromJsonapi.surname).toEqual('Brooks');
      expect(person1FromJsonapi.address).toBeUndefined();
      expect(person1FromJsonapi.old_addresses).toEqual([]);
    });

    it('should deserialise an object with unresolved relationships left as identifiers', () => {
      const person1FromJsonapi: Person = fromJsonApiResourceObject(person1Jsonapi, {}, true);
      expect(person1FromJsonapi).toEqual(jasmine.any(Person));
      expect(person1FromJsonapi.id).toEqual('person1');
      expect(person1FromJsonapi.firstName).toEqual('David');
      expect(person1FromJsonapi.surname).toEqual('Brooks');
      expect(person1FromJsonapi.address).toEqual(jsonapiIdentifier(address1));
      expect(person1FromJsonapi.old_addresses).toEqual([jsonapiIdentifier(address2)]);
    });

    it('should deserialise an object with resolvable relationships', () => {
      const INCLUDED = {
        [byTypeAndId(address1)]: address1Jsonapi,
        [byTypeAndId(address2)]: address2Jsonapi,
      };

      const person1FromJsonapi: Person = fromJsonApiResourceObject(person1Jsonapi, INCLUDED, true);
      expect(person1FromJsonapi).toEqual(jasmine.any(Person));
      expect(person1FromJsonapi.id).toEqual('person1');
      expect(person1FromJsonapi.firstName).toEqual('David');
      expect(person1FromJsonapi.surname).toEqual('Brooks');
      expect(person1FromJsonapi.address).toEqual(address1);
      expect(person1FromJsonapi.old_addresses).toEqual([address2]);
    });
  });
});