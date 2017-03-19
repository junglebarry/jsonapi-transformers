import {
  attribute,
  entity,
  relationship,
  getAttributeNames,
  getRelationshipNames,
  fromJsonApiTopLevel,
  toJsonApi,
  JsonapiEntity,
  ATTRIBUTES_MAP,
  RELATIONSHIPS_MAP
} from '../src';

declare const console;

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

const jsonify = (json) => JSON.stringify(json, null, '\t');

console.log('toJsonApi', jsonify(toJsonApi(address1)));
console.log('toJsonApi', jsonify(toJsonApi(person)));

const personJsonapi = { data: toJsonApi(person) };
const address1Jsonapi = toJsonApi(address1);
const address2Jsonapi = toJsonApi(address2);
console.log('fromJsonApi', jsonify(fromJsonApiTopLevel(personJsonapi, [address1Jsonapi, address2Jsonapi])));
