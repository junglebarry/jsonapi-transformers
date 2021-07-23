export const FAKE_SINGLE_SUBTYPE_RESPONSE = {
  data: {
    id: "mog",
    type: "cats",
    attributes: {
      name: "Mog",
      lives_left: 8,
    },
    links: {
      self: "http://example.com/cats/mog",
      alt: "http://alt.example.com/cats/mog",
    },
    meta: {
      is_good_pet: true,
      alter_ego: "FEROCIOUS TIGER",
    },
    relationships: {
      chases: {
        data: {
          id: "miss_mouse",
          type: "mice",
        },
      },
      owner: {
        data: {
          id: "meg",
          type: "people",
        },
      },
    },
  },
  included: [
    {
      id: "meg",
      type: "people",
      attributes: {
        firstName: "Meg",
        surname: "da Witch",
      },
      links: {
        self: "http://example.com/people/meg",
        alt: "http://alt.example.com/people/meg",
      },
    },
    {
      id: "miss_mouse",
      type: "mice",
      attributes: {
        name: "Miss Mouse",
      },
      links: {
        self: "http://example.com/mice/miss_mouse",
      },
      meta: {
        isGoodPet: false,
      },
    },
  ],
};
