import {
  attribute,
  entity,
  link,
  meta,
  relationship,
  JsonapiEntity,
  OneUnresolvedIdentifierOr,
  ManyUnresolvedIdentifiersOr,
} from "../../src";

import { Address } from "./address";

@entity({ type: "people" })
export class Person extends JsonapiEntity {
  @meta({ name: "created_date_time" }) createdDateTime: string;

  @attribute() firstName: string;
  @attribute() surname: string;
  @attribute({ name: "alter_ego" }) alterEgo: string | null;

  get fullName(): string {
    return `${this.firstName} ${this.surname}`;
  }

  // relationships that are resolved to specific types
  @relationship()
  address: Address | null;
  @relationship({ name: "old_addresses" })
  oldAddresses: Address[];

  // relationships that can be resolved to identifiers or specific types
  @relationship({ allowUnresolvedIdentifiers: true })
  work_address: OneUnresolvedIdentifierOr<Address>;
  @relationship({ allowUnresolvedIdentifiers: true })
  old_work_addresses: ManyUnresolvedIdentifiersOr<Address>;

  @link() self: string;
  @link({ name: "alt" }) alternative: string;
}
