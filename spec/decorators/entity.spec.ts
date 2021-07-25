import { describe, expect, it } from "@jest/globals";
import {
  isEntityConstructorRegistered,
  ENTITIES_MAP,
  entity,
  JsonapiEntity,
  registerEntityConstructorForType,
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

  it("should throw an error", () => {
    const nonJsonapiEntity = () =>
      entity({ type: "foo" })(class extends Object {});

    expect(nonJsonapiEntity).toThrow(
      "`@entity` must only be applied to `JsonapiEntity` subtypes"
    );
  });
});

describe("registerEntityConstructorForType", () => {
  class TestEntity extends JsonapiEntity<TestEntity> {
    readonly type = "test_entities";
  }

  class NotTestEntity extends JsonapiEntity<NotTestEntity> {
    readonly type = "not_test_entities";
  }

  const removeTestEntitiesRegistration = () => {
    ENTITIES_MAP.remove("test_entities", "not_test_entities");
  };

  beforeAll(removeTestEntitiesRegistration);
  afterEach(removeTestEntitiesRegistration);

  it("should register a new type/constructor pair", () => {
    expect(
      registerEntityConstructorForType(TestEntity, "test_entities")
    ).toEqual(true);
  });

  it("should (re)register an existing type/constructor pair", () => {
    expect(
      registerEntityConstructorForType(TestEntity, "test_entities")
    ).toEqual(true);
    expect(
      registerEntityConstructorForType(TestEntity, "test_entities")
    ).toEqual(false);
  });

  it("should throw an error if attempting to replace an existing type/constructor pair", () => {
    expect(
      registerEntityConstructorForType(TestEntity, "test_entities")
    ).toEqual(true);
    expect(() =>
      registerEntityConstructorForType(NotTestEntity, "test_entities")
    ).toThrowError(
      "Attempt to reregister JSON:API type 'test_entities' to the entity constructor type: NotTestEntity"
    );
  });
});

describe("isEntityConstructorRegistered", () => {
  @entity({ type: "registered_entities" })
  class RegisteredEntity extends JsonapiEntity<RegisteredEntity> {}

  class UnregisteredEntity extends JsonapiEntity<RegisteredEntity> {
    readonly type = "unregistered_entities";
  }

  const removeTestEntitiesRegistration = () => {
    ENTITIES_MAP.remove("registered_entities", "unregistered_entities");
  };

  afterAll(removeTestEntitiesRegistration);

  it("should return true when an entity has been registered", () => {
    expect(isEntityConstructorRegistered(RegisteredEntity)).toEqual(true);
  });

  it("should return false when an entity has not been registered", () => {
    expect(isEntityConstructorRegistered(UnregisteredEntity)).toEqual(false);
  });
});
