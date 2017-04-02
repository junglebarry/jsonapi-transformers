import {
  attribute,
  entity,
  relationship,
  JsonapiEntity,
  OneUnresolvedIdentifierOr,
  ManyUnresolvedIdentifiersOr,
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
  @relationship({ allowUnresolvedIdentifiers: true })
  work_address: OneUnresolvedIdentifierOr<Address>;
  @relationship({ allowUnresolvedIdentifiers: true })
  old_work_addresses: ManyUnresolvedIdentifiersOr<Address>;
}
