import {
  attribute,
  JsonapiEntity,
  link,
  meta,
  relationship,
} from '../../src';

export abstract class Animal extends JsonapiEntity {
  @attribute() name: string;
  @relationship() chases?: Animal;
  @link() self: string;
  @meta({ name: 'is_good_pet' }) isGoodPet: boolean;
}
