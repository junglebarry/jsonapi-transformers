import { describe, expect, it } from '@jest/globals';
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
address1.houseNumber = 8;
address1.street = 'Acacia Road';
address1.city = 'Nuttytown';
address1.county = 'West Nutshire';

const address1WithExplicitType: Address = new Address();
address1WithExplicitType.id = 'address1';
address1WithExplicitType.type = 'addresses';
address1WithExplicitType.houseNumber = 8;
address1WithExplicitType.street = 'Acacia Road';
address1WithExplicitType.city = 'Nuttytown';
address1WithExplicitType.county = 'West Nutshire';


const address2: Address = new Address();
address2.id = 'address2';
address2.street = 'Mountain Drive';
address2.city = 'Gotham City';

const person1: Person = new Person();
person1.id = 'person1';
person1.firstName = 'Eric';
person1.surname = 'Wimp';
person1.address = address1;
person1.oldAddresses = [address2];

describe('entity', () => {
  it('should respect instanceof', () => {
    expect(address1).toEqual(expect.any(Address));
    expect(address2).toEqual(expect.any(Address));
    expect(person1).toEqual(expect.any(Person));
  });

  it('should add a type property from the decorator definition', () => {
    expect(address1.type).toEqual('addresses');
    expect(address2.type).toEqual('addresses');
    expect(person1.type).toEqual('people');
  });

  it('should respect equality, even when type is manually specified', () => {
    expect(address1).toEqual(address1WithExplicitType);
  });

  it('should permit a natural JSON interpretation', () => {
    expect(address1).toEqual(expect.objectContaining({
      id: 'address1',
      type: 'addresses',
      street: 'Acacia Road',
      city: 'Nuttytown',
    }));
  });
});
