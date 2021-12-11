import { attribute, JsonapiEntity, link, meta, relationship } from "../../src";

export abstract class Animal extends JsonapiEntity {
  @attribute() name: string;
  @relationship() chases: Animal | null;
  @link() self: string;
  @meta({ name: "created_date_time" }) createdDateTime: string;
}
