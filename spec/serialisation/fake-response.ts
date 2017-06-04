export const FAKE_JSON = {
  "data": [
    {
      "attributes": {
        "citation": "<div data-item-id=\"ITEM-1\" class=\"csl-entry\">K. R. M. Short (1979) <i>The dynamite war</i>. Atlantic Highlands, N.J: Humanities Press.</div>"
      },
      "id": "E9B8193A-9C7C-5C7E-60F3-86B19E849B4A",
      "type": "items",
      "relationships": {
        "container": {
          "data": {
            "id": "F9F05ADA-D2F6-DC21-64E0-A2A458254AE9",
            "type": "sections"
          }
        },
        "list": {
          "data": {
            "type": "lists",
            "id": "12AC6083-C8F7-44B9-5113-BC9C26D98CA8"
          }
        },
        "resource": {
          "data": {
            "type": "resources",
            "id": "3FAF4E21-14EB-B697-0012-3C971D49EE7A"
          }
        }
      }
    }
  ],
  "links": {
    "current": "https://rl.talis.com/3/preview/lists/12AC6083-C8F7-44B9-5113-BC9C26D98CA8/items?offset=0&limit=1&draft=0&include=list%2Clist.period%2Clist.owner%2Clist.nodes%2Clist.sections",
    "next": "https://rl.talis.com/3/preview/lists/12AC6083-C8F7-44B9-5113-BC9C26D98CA8/items?offset=1&limit=1&draft=0&include=list%2Clist.period%2Clist.owner%2Clist.nodes%2Clist.sections"
  },
  "meta": {
    "count": 1,
    "limit": 1,
    "offset": 0,
    "total": 7
  },
  "included": [
    {
      "id": "F9F05ADA-D2F6-DC21-64E0-A2A458254AE9",
      "type": "sections",
      "attributes": {
        "title": "Section one",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum commodo mauris, vel pretium ni\n"
      }
    },
    {
      "id": "331B2B5F-B5B0-72FE-C282-0F90C4408BAE",
      "type": "sections",
      "attributes": {
        "title": "Section two",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum commodo mauris, vel pretium ni"
      },
      "relationships": {
        "children": {
          "data": [
            {
              "id": "51DAFBE1-5E1E-2BA8-25F3-AD9B506A1F21",
              "type": "sections"
            }
          ]
        }
      }
    },
    {
      "id": "51DAFBE1-5E1E-2BA8-25F3-AD9B506A1F21",
      "type": "sections",
      "attributes": {
        "title": "Section two b",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum commodo mauris, vel pretium ni"
      }
    },
    {
      "id": "00355A3F-09BF-459C-84D9-27369EAA8358",
      "type": "agents",
      "attributes": {
        "first_name": "David James",
        "surname": "Brooks"
      }
    },
    {
      "type": "lists",
      "attributes": {
        "description": "Mirrors the structure (but not items) of the Invision mock for list UX:\n\nhttps://projects.invisionapp.com/d/main#/console/1604312/109984022/preview",
        "date_created": "2016-07-29T11:33:36+01:00",
        "last_published": "2016-09-08T14:30:58+01:00",
        "last_updated": "2016-07-29T12:25:04+01:00",
        "title": "Invision Mirror list",
        "published_status": "published"
      },
      "id": "12AC6083-C8F7-44B9-5113-BC9C26D98CA8",
      "relationships": {
        "sections": {
          "data": [
            {
              "id": "F9F05ADA-D2F6-DC21-64E0-A2A458254AE9",
              "type": "sections"
            },
            {
              "id": "331B2B5F-B5B0-72FE-C282-0F90C4408BAE",
              "type": "sections"
            }
          ]
        },
        "owner": {
          "data": {
            "id": "00355A3F-09BF-459C-84D9-27369EAA8358",
            "type": "agents"
          }
        }
      }
    }
  ]
};
