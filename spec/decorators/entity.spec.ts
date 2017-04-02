import {
  attribute,
  entity,
  relationship,
  toJsonApi,
  JsonapiEntity,
} from '../../src';

import {
  Address,
  Person,
} from '../test-data';

const address1: Address = new Address();
address1.id = 'address1';
address1.street = '8 Midland Road';
address1.city = 'Birmingham';

const address2: Address = new Address();
address2.id = 'address2';
address2.street = '97 Clarence Road';
address2.city = 'Birmingham';

const person1: Person = new Person();
person1.id = 'person1';
person1.firstName = 'David';
person1.surname = 'Brooks';
person1.address = address1;
person1.oldAddresses = [address2];

describe('entity', () => {
  it('should respect instanceof', () => {
    expect(address1).toEqual(jasmine.any(Address));
    expect(address2).toEqual(jasmine.any(Address));
    expect(person1).toEqual(jasmine.any(Person));
  });

  it('should add a type property from the decorator definition', () => {
    expect(address1.type).toEqual('addresses');
    expect(address2.type).toEqual('addresses');
    expect(person1.type).toEqual('people');
  });

  it('should permit a natural JSON interpretation', () => {
    expect(address1).toEqual(jasmine.objectContaining({
      id: 'address1',
      type: 'addresses',
      street: '8 Midland Road',
      city: 'Birmingham',
    }));
  });
});
