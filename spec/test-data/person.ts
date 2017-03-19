import {
  attribute,
  entity,
  relationship,
  JsonapiEntity,
} from '../../src';

import { Address } from './address';

@entity({ type: 'people' })
export class Person extends JsonapiEntity {
  @attribute firstName: string;
  @attribute surname: string;
  @relationship address: Address;
  @relationship old_addresses: Address[];
}
