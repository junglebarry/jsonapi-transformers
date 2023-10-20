import { attribute, JsonapiEntity, link, meta, relationship } from "../../src";

export abstract class Animal<A extends Animal<A>> extends JsonapiEntity<A> {
  @attribute() name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- recursive type cannot be known
  @relationship() chases: Animal<any> | null;
  @link() self: string;
  @meta({ name: "created_date_time" }) createdDateTime: string;
}
