import { attribute, entity, relationship, JsonapiEntity } from "../../src";

import { Person } from "./person";

@entity({ type: "addresses" })
export class Address extends JsonapiEntity {
  @attribute() houseNumber?: number;
  @attribute() street: string;
  @attribute() city: string;
  @attribute() county?: string;
  @relationship({ name: "most_famous_inhabitant" })
  mostFamousInhabitant?: Person;
}
