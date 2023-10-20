import { describe, expect, it } from "@jest/globals";
import { fromJsonApiTopLevel } from "../../src";

import {
  Address,
  Animal,
  Author,
  BlogPost,
  Cat,
  Person,
  Tag,
} from "../test-data";

import * as FAKE_SINGLE_RESPONSE from "../test-data/jsonapi/fake-single-response.json";
import * as FAKE_SINGLE_SUBTYPE_RESPONSE from "../test-data/jsonapi/fake-single-subtype-response.json";
import * as FAKE_MULTIPLE_RESPONSE from "../test-data/jsonapi/fake-multiple-response.json";
import * as FAKE_README_AUTHOR_ONLY from "../test-data/jsonapi/fake-author1-response.json";
import * as FAKE_README_BLOG_ONLY from "../test-data/jsonapi/fake-post1-response.json";
import * as FAKE_README_TAG1_ONLY from "../test-data/jsonapi/fake-tag1-response.json";
import * as FAKE_README_TAG2_ONLY from "../test-data/jsonapi/fake-tag2-response.json";
import * as FAKE_README_BLOG_EXAMPLE_WITH_INCLUDES from "../test-data/jsonapi/fake-post1-include-all-response.json";

describe("deserialisers", () => {
  describe("fromJsonApiTopLevel", () => {
    describe("JSON API top-level datum deserialisation", () => {
      const { deserialised } = fromJsonApiTopLevel(FAKE_SINGLE_RESPONSE);
      const PERSON_1: Person = deserialised;

      it("should deserialise the top-level datum from the response, populating object attributes", () => {
        expect(PERSON_1).toEqual(expect.any(Person));
        const { id, type, firstName, surname } = PERSON_1;
        expect(id).toEqual("person1");
        expect(type).toEqual("people");
        expect(firstName).toEqual("Eric");
        expect(surname).toEqual("Wimp");
      });

      it("should deserialise decorated object links", () => {
        expect(PERSON_1).toEqual(expect.any(Person));
        const { self, alternative } = PERSON_1;
        expect(self).toEqual("http://example.com/people/person1");
        expect(alternative).toEqual("http://alt.example.com/people/person1");
      });

      it("should deserialise decorated object meta information", () => {
        expect(PERSON_1).toEqual(expect.any(Person));
        const { alterEgo } = PERSON_1;
        expect(alterEgo).toEqual("BANANAMAN");
      });

      it("should deserialise related objects, populating their properties", () => {
        expect(PERSON_1.address).toEqual(expect.any(Address));
        const { houseNumber, street, city } = PERSON_1.address;
        expect(houseNumber).toEqual(29);
        expect(street).toEqual("Acacia Road");
        expect(city).toEqual("Nuttytown");
      });

      it("should deserialise related object arrays with the same type but different name, populating their properties", () => {
        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(2);

        const [oldAddress1, oldAddress2] = PERSON_1.oldAddresses;
        expect(oldAddress1).toEqual(expect.any(Address));
        expect(oldAddress1.houseNumber).toEqual(1007);
        expect(oldAddress1.street).toEqual("Mountain Drive");
        expect(oldAddress1.city).toEqual("Gotham City");

        expect(oldAddress2).toEqual(expect.any(Address));
        expect(oldAddress2.houseNumber).toEqual(29);
        expect(oldAddress2.street).toEqual("Acacia Road");
        expect(oldAddress2.city).toEqual("Nuttytown");
      });

      it("should recursively deserialise related objects, populating their properties", () => {
        // traverse one level
        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(2);
        const [oldAddress1, oldAddress2] = PERSON_1.oldAddresses;
        expect(oldAddress1).toEqual(expect.any(Address));
        expect(oldAddress2).toEqual(expect.any(Address));

        // traverse two levels
        const { mostFamousInhabitant } = oldAddress1;
        expect(mostFamousInhabitant).toEqual(expect.any(Person));
        expect(mostFamousInhabitant.id).toEqual("person2");
        expect(mostFamousInhabitant.type).toEqual("people");
        expect(mostFamousInhabitant.firstName).toEqual("Bruce");
        expect(mostFamousInhabitant.surname).toEqual("Wayne");

        // traverse three levels
        expect(mostFamousInhabitant.address).toEqual(expect.any(Address));
        const { address } = mostFamousInhabitant;
        expect(address.houseNumber).toEqual(1007);
        expect(address.street).toEqual("Mountain Drive");
        expect(address.city).toEqual("Gotham City");
      });
    });

    describe("JSON API top-level data deserialisation", () => {
      const { deserialised } = fromJsonApiTopLevel(FAKE_MULTIPLE_RESPONSE);
      const PEOPLE: Person[] = deserialised;

      it("should deserialise each item in the top-level data from the response", () => {
        expect(PEOPLE).toEqual(expect.any(Array));
        expect(PEOPLE.length).toEqual(2);

        const [PERSON_1, PERSON_2] = PEOPLE;

        expect(PERSON_1).toEqual(expect.any(Person));
        expect(PERSON_2).toEqual(expect.any(Person));
      });

      it("should deserialise the top-level data from the response, populating object attributes", () => {
        const [PERSON_1] = PEOPLE;

        const { id, type, firstName, surname } = PERSON_1;

        expect(id).toEqual("person1");
        expect(type).toEqual("people");
        expect(firstName).toEqual("Eric");
        expect(surname).toEqual("Wimp");
      });

      it("should deserialise decorated object links", () => {
        const [PERSON_1] = PEOPLE;
        expect(PERSON_1).toEqual(expect.any(Person));

        const { self, alternative } = PERSON_1;
        expect(self).toEqual("http://example.com/people/person1");
        expect(alternative).toEqual("http://alt.example.com/people/person1");
      });

      it("should deserialise decorated object meta information", () => {
        const [PERSON_1] = PEOPLE;
        expect(PERSON_1).toEqual(expect.any(Person));

        const { alterEgo } = PERSON_1;
        expect(alterEgo).toEqual("BANANAMAN");
      });

      it("should deserialise related objects, populating their properties", () => {
        const [PERSON_1] = PEOPLE;

        expect(PERSON_1.address).toEqual(expect.any(Address));
        const { houseNumber, street, city } = PERSON_1.address;
        expect(houseNumber).toEqual(29);
        expect(street).toEqual("Acacia Road");
        expect(city).toEqual("Nuttytown");
      });

      it("should deserialise related objects with the same type but different name, populating their properties", () => {
        const [PERSON_1] = PEOPLE;

        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(2);

        const [oldAddress1, oldAddress2] = PERSON_1.oldAddresses;
        expect(oldAddress1).toEqual(expect.any(Address));
        expect(oldAddress1.houseNumber).toEqual(1007);
        expect(oldAddress1.street).toEqual("Mountain Drive");
        expect(oldAddress1.city).toEqual("Gotham City");

        expect(oldAddress2).toEqual(expect.any(Address));
        expect(oldAddress2.houseNumber).toEqual(29);
        expect(oldAddress2.street).toEqual("Acacia Road");
        expect(oldAddress2.city).toEqual("Nuttytown");
      });

      it("should recursively deserialise related objects, populating their properties", () => {
        const [PERSON_1] = PEOPLE;

        // traverse one level
        expect(PERSON_1.oldAddresses).toBeDefined();
        expect(PERSON_1.oldAddresses.length).toEqual(2);
        const [oldAddress1, oldAddress2] = PERSON_1.oldAddresses;
        expect(oldAddress1).toEqual(expect.any(Address));
        expect(oldAddress2).toEqual(expect.any(Address));

        // traverse two levels
        const { mostFamousInhabitant } = oldAddress1;
        expect(mostFamousInhabitant).toEqual(expect.any(Person));
        expect(mostFamousInhabitant.id).toEqual("person2");
        expect(mostFamousInhabitant.type).toEqual("people");
        expect(mostFamousInhabitant.firstName).toEqual("Bruce");
        expect(mostFamousInhabitant.surname).toEqual("Wayne");

        // traverse three levels
        expect(mostFamousInhabitant.address).toEqual(expect.any(Address));
        const { address } = mostFamousInhabitant;
        expect(address.houseNumber).toEqual(1007);
        expect(address.street).toEqual("Mountain Drive");
        expect(address.city).toEqual("Gotham City");
      });
    });

    describe("JSON API top-level datum deserialisation of a subtype of an unregistered entity", () => {
      const { deserialised } = fromJsonApiTopLevel(
        FAKE_SINGLE_SUBTYPE_RESPONSE,
      );
      const CAT_1: Cat = deserialised;

      it("should deserialise the top-level datum from the response, populating object attributes", () => {
        expect(CAT_1).toEqual(expect.any(Cat));
        const { id, type, name, livesLeft } = CAT_1;
        expect(id).toEqual("mog");
        expect(type).toEqual("cats");
        expect(livesLeft).toEqual(8);
        // supertype properties
        expect(name).toEqual("Mog");
      });

      it("should deserialise decorated object links", () => {
        expect(CAT_1).toEqual(expect.any(Cat));
        const { self, alternative } = CAT_1;
        expect(alternative).toEqual("http://alt.example.com/cats/mog");
        // supertype properties
        expect(self).toEqual("http://example.com/cats/mog");
      });

      it("should deserialise decorated object meta information", () => {
        expect(CAT_1).toEqual(expect.any(Cat));
        const { createdDateTime } = CAT_1;
        expect(createdDateTime).toEqual("2021-07-23T11:39:17.353Z");
      });

      it("should deserialise related objects, populating their properties", () => {
        expect(CAT_1.petOwner).toEqual(expect.any(Person));
        const { fullName } = CAT_1.petOwner;
        expect(fullName).toEqual("Meg da Witch");

        // supertype properties
        expect(CAT_1.chases).toEqual(expect.any(Animal));
        const { name } = CAT_1.chases;
        expect(name).toEqual("Miss Mouse");
      });
    });
  });

  describe("README examples", () => {
    describe("author only", () => {
      const { deserialised } = fromJsonApiTopLevel(FAKE_README_AUTHOR_ONLY);
      const AUTHOR_1: Author = deserialised;

      it("should deserialise the primary datum from the response", () => {
        expect(AUTHOR_1).toEqual(expect.any(Author));
      });

      it("should deserialise attributes from the primary datum", () => {
        expect(AUTHOR_1.name).toEqual("David Brooks");
      });

      it("should deserialise meta from the primary datum", () => {
        expect(AUTHOR_1.lastLoginDateTime).toEqual("2021-06-24T10:00:00.000Z");
      });
    });

    describe("tag1 only", () => {
      const { deserialised } = fromJsonApiTopLevel(FAKE_README_TAG1_ONLY);
      const TAG_1: Tag = deserialised;

      it("should deserialise the primary datum from the response", () => {
        expect(TAG_1).toEqual(expect.any(Tag));
      });

      it("should deserialise attributes from the primary datum", () => {
        expect(TAG_1.label).toEqual("one");
      });
    });

    describe("tag2 only", () => {
      const { deserialised } = fromJsonApiTopLevel(FAKE_README_TAG2_ONLY);
      const TAG_2: Tag = deserialised;

      it("should deserialise the primary datum from the response", () => {
        expect(TAG_2).toEqual(expect.any(Tag));
      });

      it("should deserialise attributes from the primary datum", () => {
        expect(TAG_2.label).toEqual("two");
      });
    });

    describe("blog post only", () => {
      const { deserialised } = fromJsonApiTopLevel(FAKE_README_BLOG_ONLY);
      const POST_ONLY_1: BlogPost = deserialised;

      it("should deserialise the primary datum from the response", () => {
        expect(POST_ONLY_1).toEqual(expect.any(BlogPost));
      });

      it("should deserialise attributes from the primary datum", () => {
        const { title, content } = POST_ONLY_1;
        expect(title).toEqual("Introducing jsonapi-transformers");
        expect(content).toEqual("<strong>It lives!</strong>");
      });

      it("should deserialise links from the primary datum", () => {
        expect(POST_ONLY_1.self).toEqual(
          "https://example.com/my-jsonapi/blog_posts/post1",
        );
      });

      it("should deserialise meta from the primary datum", () => {
        expect(POST_ONLY_1.createdDateTime).toEqual("2021-06-24T10:00:00.000Z");
      });

      it("should NOT deserialise to-one relationships, leaving them undefined", () => {
        expect(POST_ONLY_1.author).toBeUndefined();
      });

      it("should NOT deserialise to-many relationships, leaving them as an empty array", () => {
        expect(POST_ONLY_1.tags).toEqual([]);
      });
    });

    describe("full example with includes", () => {
      const { deserialised } = fromJsonApiTopLevel(
        FAKE_README_BLOG_EXAMPLE_WITH_INCLUDES,
      );
      const POST_1: BlogPost = deserialised;

      it("should deserialise the primary datum from the response", () => {
        expect(POST_1).toEqual(expect.any(BlogPost));
      });

      it("should deserialise attributes from the primary datum", () => {
        const { title, content } = POST_1;
        expect(title).toEqual("Introducing jsonapi-transformers");
        expect(content).toEqual("<strong>It lives!</strong>");
      });

      it("should deserialise links from the primary datum", () => {
        expect(POST_1.self).toEqual(
          "https://example.com/my-jsonapi/blog_posts/post1",
        );
      });

      it("should deserialise meta from the primary datum", () => {
        expect(POST_1.createdDateTime).toEqual("2021-06-24T10:00:00.000Z");
      });

      it("should deserialise included objects, populating their properties", () => {
        expect(POST_1.author).toEqual(expect.any(Author));
        expect(POST_1.author.name).toEqual("David Brooks");

        const tags = POST_1.tags;
        expect(tags.length).toEqual(2);
        const [tag1, tag2] = tags;
        expect(tag1).toEqual(expect.any(Tag));
        expect(tag1.label).toEqual("one");
        expect(tag2).toEqual(expect.any(Tag));
        expect(tag2.label).toEqual("two");
      });
    });
  });
});
