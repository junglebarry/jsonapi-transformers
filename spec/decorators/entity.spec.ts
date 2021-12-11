import { describe, expect, it } from "@jest/globals";
import { Address, Person } from "../test-data";

const address1: Address = new Address({
  id: "address1",
  houseNumber: 8,
  street: "Acacia Road",
  city: "Nuttytown",
  county: "West Nutshire",
});

const address2: Address = new Address({
  id: "address2",
  street: "Mountain Drive",
  city: "Gotham City",
});

const person1: Person = new Person({
  id: "person1",
  firstName: "Eric",
  surname: "Wimp",
  address: address1,
  oldAddresses: [address2],
});

describe("entity", () => {
  it("should respect instanceof", () => {
    expect(address1).toEqual(expect.any(Address));
    expect(address2).toEqual(expect.any(Address));
    expect(person1).toEqual(expect.any(Person));
  });

  it("should add a type property from the decorator definition", () => {
    expect(address1.type).toEqual("addresses");
    expect(address2.type).toEqual("addresses");
    expect(person1.type).toEqual("people");
  });

  it("should permit a natural JSON interpretation", () => {
    expect(address1).toEqual(
      expect.objectContaining({
        id: "address1",
        type: "addresses",
        street: "Acacia Road",
        city: "Nuttytown",
      })
    );
  });
});
