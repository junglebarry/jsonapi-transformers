import { describe, expect, it } from "@jest/globals";
import {
  byTypeAndId,
  fromJsonApiResourceObject,
  toJsonApi,
  unresolvedIdentifier,
} from "../../src";

import { Address, Person } from "../test-data";

const address1: Address = Address.create({
  id: "address1",
  houseNumber: 8,
  street: "Acacia Road",
  city: "Nuttytown",
  county: "West Nutshire",
});

const address2: Address = Address.create({
  id: "address2",
  street: "Mountain Drive",
  city: "Gotham City",
});

const person1: Person = Person.create({
  id: "person1",
  firstName: "Eric",
  surname: "Wimp",
  address: address1,
  oldAddresses: [address2],
  createdDateTime: "2021-12-06T18:15:45",
});

const person2: Person = Person.create({
  id: "person2",
  firstName: "Bruce",
  surname: "Wayne",
  work_address: address2,
  old_work_addresses: [address1],
  alterEgo: "2021-12-06T18:31:11",
});

describe("serialisers", () => {
  describe("toJsonApi", () => {
    it("should serialise to JSON API including attributes - legacy property assignment", () => {
      expect(toJsonApi(address2)).toEqual({
        id: "address2",
        type: "addresses",
        attributes: {
          street: "Mountain Drive",
          city: "Gotham City",
        },
      });
    });

    it("should serialise to JSON API including attributes - constructor assignment", () => {
      expect(toJsonApi(address1)).toEqual({
        id: "address1",
        type: "addresses",
        attributes: {
          houseNumber: 8,
          street: "Acacia Road",
          city: "Nuttytown",
          county: "West Nutshire",
        },
      });
    });

    it("should serialise to JSON API including attributes, meta, and relationships", () => {
      expect(toJsonApi(person1)).toEqual({
        id: "person1",
        type: "people",
        attributes: {
          firstName: "Eric",
          surname: "Wimp",
        },
        meta: {
          created_date_time: "2021-12-06T18:15:45",
        },
        relationships: {
          address: {
            data: {
              id: "address1",
              type: "addresses",
            },
          },
          old_addresses: {
            data: [
              {
                id: "address2",
                type: "addresses",
              },
            ],
          },
        },
      });
    });
  });

  describe("fromJsonApiResourceObject", () => {
    const address1Jsonapi = toJsonApi(address1);
    const address2Jsonapi = toJsonApi(address2);
    const person1Jsonapi = toJsonApi(person1);
    const person2Jsonapi = toJsonApi(person2);

    it("should deserialise an object without relationships", () => {
      const address1FromJsonapi: Address = fromJsonApiResourceObject(
        address1Jsonapi,
        {},
      );
      expect(address1FromJsonapi).toEqual(expect.any(Address));
      expect(address1FromJsonapi).toEqual(address1);
    });

    it("should deserialise an object with unresolved relationships omitted", () => {
      const person1FromJsonapi: Person = fromJsonApiResourceObject(
        person1Jsonapi,
        {},
      );
      expect(person1FromJsonapi).toEqual(expect.any(Person));
      expect(person1FromJsonapi.id).toEqual("person1");
      expect(person1FromJsonapi.firstName).toEqual("Eric");
      expect(person1FromJsonapi.surname).toEqual("Wimp");
      expect(person1FromJsonapi.address).toBeUndefined();
      expect(person1FromJsonapi.oldAddresses).toEqual([]);
      expect(person1FromJsonapi.work_address).toBeFalsy();
      expect(person1FromJsonapi.old_work_addresses).toBeFalsy();
    });

    it("should deserialise an object with unresolved relationships left as identifiers", () => {
      const person2FromJsonapi: Person = fromJsonApiResourceObject(
        person2Jsonapi,
        {},
      );
      expect(person2FromJsonapi).toEqual(expect.any(Person));
      expect(person2FromJsonapi.id).toEqual("person2");
      expect(person2FromJsonapi.firstName).toEqual("Bruce");
      expect(person2FromJsonapi.surname).toEqual("Wayne");
      expect(person2FromJsonapi.address).toBeFalsy();
      expect(person2FromJsonapi.oldAddresses).toBeFalsy();
      expect(person2FromJsonapi.work_address).toEqual(
        unresolvedIdentifier(address2),
      );
      expect(person2FromJsonapi.old_work_addresses).toEqual([
        unresolvedIdentifier(address1),
      ]);
    });

    it("should deserialise an object with resolvable relationships", () => {
      const INCLUDED = {
        [byTypeAndId(address1)]: address1Jsonapi,
        [byTypeAndId(address2)]: address2Jsonapi,
      };

      const person1FromJsonapi: Person = fromJsonApiResourceObject(
        person1Jsonapi,
        INCLUDED,
      );
      expect(person1FromJsonapi).toEqual(expect.any(Person));
      expect(person1FromJsonapi.id).toEqual("person1");
      expect(person1FromJsonapi.firstName).toEqual("Eric");
      expect(person1FromJsonapi.surname).toEqual("Wimp");
      expect(person1FromJsonapi.address).toEqual(address1);
      expect(person1FromJsonapi.oldAddresses).toEqual([address2]);
    });
  });
});
