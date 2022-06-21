import { describe, expect, it } from "@jest/globals";
import {
  attribute,
  JsonapiEntity,
  meta,
  newEntity,
  relationship,
} from "../../src";

describe("JsonapiEntity", () => {
  class FakeSimpleJsonapiEntity extends JsonapiEntity<FakeSimpleJsonapiEntity> {
    readonly type = "simples";
  }

  class FakeComplexJsonapiEntity extends JsonapiEntity<FakeComplexJsonapiEntity> {
    readonly type = "complexities";

    someNonJsonapiProperty: string;

    @attribute() someAttr: string;
    @attribute({ name: "some_other_attr" }) someOtherAttr: string;
    @meta() someMeta: string;
    @meta({ name: "some_other_meta" }) someOtherMeta: string;
    @relationship() someSimple: FakeSimpleJsonapiEntity;
    @relationship({ name: "some_other_simple" })
    someOtherSimple: FakeSimpleJsonapiEntity;
  }

  describe("construction", () => {
    it("does not reliably permit property specification. This was DEPRECATED with v3. The test is left to show the behaviour is unreliable", () => {
      const fake = new FakeComplexJsonapiEntity({
        id: "complex1",
        someNonJsonapiProperty: "someNonJsonapiProperty!",
        someAttr: "someAttr!",
        someOtherAttr: "someOtherAttr!",
        someMeta: "someMeta!",
        someOtherMeta: "someOtherMeta!",
        someSimple: new FakeSimpleJsonapiEntity({ id: "simple1" }),
        someOtherSimple: new FakeSimpleJsonapiEntity({ id: "simple2" }),
      });
      expect(fake.id).toEqual("complex1");
      expect(fake.someNonJsonapiProperty).toBeUndefined();
      expect(fake.someAttr).toBeUndefined();
      expect(fake.someOtherAttr).toBeUndefined();
      expect(fake.someMeta).toBeUndefined();
      expect(fake.someOtherMeta).toBeUndefined();
      expect(fake.someSimple).toBeUndefined();
      expect(fake.someOtherSimple).toBeUndefined();
    });
  });

  describe("newEntity", () => {
    it("should permit property specification for all properties", () => {
      const fake = newEntity(FakeComplexJsonapiEntity, {
        id: "complex1",
        someNonJsonapiProperty: "someNonJsonapiProperty!",
        someAttr: "someAttr!",
        someOtherAttr: "someOtherAttr!",
        someMeta: "someMeta!",
        someOtherMeta: "someOtherMeta!",
        someSimple: newEntity(FakeSimpleJsonapiEntity, { id: "simple1" }),
        someOtherSimple: newEntity(FakeSimpleJsonapiEntity, { id: "simple2" }),
      });
      expect(fake.id).toEqual("complex1");
      expect(fake.someNonJsonapiProperty).toEqual("someNonJsonapiProperty!");
      expect(fake.someAttr).toEqual("someAttr!");
      expect(fake.someOtherAttr).toEqual("someOtherAttr!");
      expect(fake.someMeta).toEqual("someMeta!");
      expect(fake.someOtherMeta).toEqual("someOtherMeta!");
      expect(fake.someSimple).toEqual(
        newEntity(FakeSimpleJsonapiEntity, { id: "simple1" })
      );
      expect(fake.someOtherSimple).toEqual(
        newEntity(FakeSimpleJsonapiEntity, { id: "simple2" })
      );
    });
  });

  describe("create", () => {
    it("should permit property specification for all properties", () => {
      const fake = FakeComplexJsonapiEntity.create({
        id: "complex1",
        someNonJsonapiProperty: "someNonJsonapiProperty!",
        someAttr: "someAttr!",
        someOtherAttr: "someOtherAttr!",
        someMeta: "someMeta!",
        someOtherMeta: "someOtherMeta!",
        someSimple: FakeSimpleJsonapiEntity.create({ id: "simple1" }),
        someOtherSimple: FakeSimpleJsonapiEntity.create({ id: "simple2" }),
      });
      expect(fake.id).toEqual("complex1");
      expect(fake.someNonJsonapiProperty).toEqual("someNonJsonapiProperty!");
      expect(fake.someAttr).toEqual("someAttr!");
      expect(fake.someOtherAttr).toEqual("someOtherAttr!");
      expect(fake.someMeta).toEqual("someMeta!");
      expect(fake.someOtherMeta).toEqual("someOtherMeta!");
      expect(fake.someSimple).toEqual(
        FakeSimpleJsonapiEntity.create({ id: "simple1" })
      );
      expect(fake.someOtherSimple).toEqual(
        FakeSimpleJsonapiEntity.create({ id: "simple2" })
      );
    });
  });
});
