import {
  attribute,
  entity,
  JsonapiEntity,
} from '../../src';

@entity({ type: 'addresses' })
export class Address extends JsonapiEntity {
  @attribute() houseNumber?: number;
  @attribute() street: string;
  @attribute() city: string;
  @attribute() county?: string;
}
