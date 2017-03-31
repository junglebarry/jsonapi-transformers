import {
  attribute,
  entity,
  relationship,
  JsonapiEntity,
  OneIdentifierOr,
  ManyIdentifiersOr,
} from '../../src';

import { Address } from './address';

@entity({ type: 'people' })
export class Person extends JsonapiEntity {
  @attribute() firstName: string;
  @attribute() surname: string;

  get fullName(): string {
    return `${this.firstName} ${this.surname}`;
  }

  // relationships that are resolved to specific types
  @relationship()
  address: Address;
  @relationship({ name: 'old_addresses' })
  oldAddresses: Address[];

  // relationships that can be resolved to identifiers or specific types
  @relationship({ allowIdentifiersIfUnresolved: true })
  work_address: OneIdentifierOr<Address>;
  @relationship({ allowIdentifiersIfUnresolved: true })
  old_work_addresses: ManyIdentifiersOr<Address>;
}
