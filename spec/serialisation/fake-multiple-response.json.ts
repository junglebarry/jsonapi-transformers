export const FAKE_MULTIPLE_RESPONSE = {
  "data": [
    {
      "id": "person1",
      "type": "people",
      "attributes": {
        "firstName": "Eric",
        "surname": "Wimp"
      },
      "links": {
        "self": "http://example.com/people/person1",
        "alt": "http://alt.example.com/people/person1",
      },
      "meta": {
        "alter_ego": "BANANAMAN"
      },
      "relationships": {
        "address": {
          "data": {
            "id": "address1",
            "type": "addresses"
          }
        },
        "old_addresses": {
          "data": [
            {
              "id": "address2",
              "type": "addresses"
            },
            {
              "id": "address1",
              "type": "addresses"
            }
          ]
        }
      }
    },
    {
      "id": "person2",
      "type": "people",
      "attributes": {
        "firstName": "Bruce",
        "surname": "Wayne"
      },
      "links": {
        "self": "http://example.com/people/person2",
        "alt": "http://alt.example.com/people/person2",
      },
      "meta": {
        "alter_ego": "BATMAN"
      },
      "relationships": {
        "address": {
          "data": {
            "id": "address2",
            "type": "addresses"
          }
        }
      }
    }
  ],
  "included": [
    {
      "id": "address1",
      "type": "addresses",
      "attributes": {
        "houseNumber": 29,
        "street": "Acacia Road",
        "city": "Nuttytown"
      }
    },
    {
      "id": "address2",
      "type": "addresses",
      "attributes": {
        "houseNumber": 1007,
        "street": "Mountain Drive",
        "city": "Gotham City"
      },
      "relationships": {
        "most_famous_inhabitant": {
          "data": {
            "id": "person2",
            "type": "people"
          }
        }
      }
    }
  ]
}
