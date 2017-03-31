import {
  attribute,
  entity,
  relationship,
  toJsonApi,
  JsonapiEntity,
} from '../src';

@entity({ type: 'addresses' })
class Address extends JsonapiEntity {
  @attribute houseNumber?: number;
  @attribute street: string;
  @attribute city: string;
  @attribute county?: string;
}

@entity({ type: 'people' })
class Person extends JsonapiEntity {
  @attribute firstName: string;
  @attribute surname: string;
  @relationship address: Address;
  @relationship old_addresses: Address[];
}


  const address1: Address = new Address();
  address1.id = 'address1';
  address1.street = '8 Midland Road';
  address1.city = 'Birmingham';

  const address2: Address = new Address();
  address2.id = 'address2';
  address2.street = '97 Clarence Road';
  address2.city = 'Birmingham';

  const person: Person = new Person();
  person.id = 'person1';
  person.firstName = 'David';
  person.surname = 'Brooks';
  person.address = address1;
  person.old_addresses = [address2];


describe('E2E', () => {

  describe('toJsonApi', () => {
    it('should serialise', () => {
      expect(address1).toEqual(jasmine.objectContaining({
        id: 'address1',
        type: 'addresses',
        street: '8 Midland Road',
        city: 'Birmingham',
      }));
      expect(toJsonApi(address1)).toEqual(jasmine.objectContaining({
        id: 'address1',
        type: 'addresses',
        attributes: {
          street: '8 Midland Road',
          city: 'Birmingham',
        },
      }));
    });
  });
});