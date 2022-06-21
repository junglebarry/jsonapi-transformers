# jsonapi-transformers

This is a library for transforming between [JSON:API](https://jsonapi.org/) responses and [Typescript classes](https://www.typescriptlang.org/docs/handbook/2/classes.html).

Specifically, it allows you to use natural Typescript classes in your application, and provides a light-touch way to transform to and from JSON:API representations.

# What does the library do?

You can define Typescript classes to represent your REST entities, and add
[Typescript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) that describe how to convert between these classes and their JSON:API representation.

This provides a way to have pleasant Typescript types for your application, but with the ability to convert to and from JSON:API when you need to interact with your APIs.

It's probably also worth knowing what this library _doesn't_ do:

- There's no HTTP layer - this is purely about serialisation - so you can use it with the HTTP layer of your choice

- As a result, there's no intention to create a seamless client-server syncing experience.

# A worked example

Imagine a simple blog application with a couple of Typescript classes declaring the major types:

```typescript
export class Author {
  lastLoginDateTime: string;
  name: string;
}

export class Tag {
  label: string;
}

export class BlogPost {
  createdDateTime: string;
  title: string;
  content: string;
  author: Author;
  tags: Tag[];
}
```

(Yes: you might normally use [`interface`s](https://www.typescriptlang.org/docs/handbook/2/objects.html) for this. We'll address that later.)

A concrete example using these types might be:

```typescript
const david = new Author({
  id: "david",
  name: "David Brooks",
  lastLoginDateTime: "2021-07-24T11:00:00.000Z",
});

const tag1 = new Tag({
  id: "tag1",
  label: "one",
});

const tag2 = new Tag({
  id: "tag2",
  label: "two",
});

const post1 = new BlogPost({
  id: "post1",
  title: "Introducing jsonapi-transformers",
  content: "<strong>It lives!</strong>",
  author: david,
  tags: [tag1, tag2],
  createdDateTime: "2021-06-24T10:00:00.000Z",
});
```

These might have the following counterpart representations in JSON:API.

For our author:

```json
{
  "id": "david",
  "type": "authors",
  "attributes": {
    "name": "David Brooks"
  },
  "meta": {
    "lastLoginDateTime": "2021-07-24T11:00:00.000Z"
  },
  "links": {
    "self": "https://example.com/my-jsonapi/authors/david"
  }
}
```

a tag:

```json
{
  "id": "tag1",
  "type": "tags",
  "attributes": {
    "label": "one"
  }
}
```

and our post:

```json
{
  "id": "post1",
  "type": "blog_posts",
  "attributes": {
    "title": "Introducing jsonapi-transformers",
    "content": "<strong>It lives!</strong>"
  },
  "relationships": {
    "author": {
      "data": {
        "id": "david",
        "type": "authors"
      }
    },
    "tags": {
      "data": [
        {
          "id": "tag1",
          "type": "tags"
        },
        {
          "id": "tag2",
          "type": "tags"
        }
      ]
    }
  },
  "meta": {
    "createdDateTime": "2021-06-24T10:00:00.000Z"
  },
  "links": {
    "self": "https://example.com/my-jsonapi/blog_posts/post1"
  }
}
```

So the question is, how can we map between each Typescript type and its JSON:API representation?

## Adding JSON:API with decorators

This library allows us to augment such classes with [Typescript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) to declare how our class instances will be translated into JSON:API representation. Here is how we extend our example classes:

```typescript
@entity({ type: "authors" })
export class Author extends JsonapiEntity {
  @meta() lastLoginDateTime: string;
  @attribute() name: string;
}

@entity({ type: "tags" })
export class Tag extends JsonapiEntity {
  @attribute() label: string;
}

@entity({ type: "blog_posts" })
export class BlogPost extends JsonapiEntity {
  @meta() createdDateTime: string;
  @attribute() title: string;
  @attribute() content: string;
  @link() self: string;
  @relationship() author: Author;
  @relationship() tags: Tag[];
}
```

We can use these instances exactly as we did before - they look like natural classes to the application. However, there are a few important differences to note:

First, we used a Typescript class to define our type, and that class must extend `JsonapiEntity`, which ensures that our class provides the mandatory `id` and `type` properties that will be needed to send these to a JSON:API API endpoint.

Second, we used the `@entity` decorator to bind our class to a JSON:API entity type. Note that `entity` is a function accepting a JSON object as its sole argument, and the `type` (as it appears in the JSON:API entity definition) must be explicitly provided. This is how `jsonapi-transformers` connects the class with its serialised form.

Third, each class property that should be serialized to JSON:API should be marked with a decorator appropriate to how it is serialized: `@attribute`, `@relationship`, `@meta`, or `@link`. We will explore these a little more below.

## Decorators

### `@entity`

The `@entity` decorator must be applied to a class, and that class must be a subtype of `JsonapiEntity`. The decorator has the following options:

```typescript
export interface EntityOptions {
  type: string;
}
```

The `type` is mandatory, and must match the `type` used by the backing API.

### Attributes

[Attributes](https://jsonapi.org/format/#document-resource-object-attributes) are literal JSON properties that exist on an entity, which may be updated via the API. Constrast this with `relationships` - which reference other entities and can be updated - and `meta` properties, which cannot be updated.

The `@attribute(options?: AttributeOptions)` decorator must be applied to a property within a `JsonapiEntity` subtype, and permits the following options:

```typescript
export interface AttributeOptions {
  name?: string;
}
```

- `name` is optional. If you omit it, the property name within the class must exactly match the property name within the JSON:API representation. However, you can specify `name` to decouple these, and use a more natural name inside your application. This might be useful if your API uses a convention for naming that doesn't fit the application, e.g. snake-case property names: `myComplexAttribute` versus `my_complex_attribute`.

### Relationships

[Relationships](https://jsonapi.org/format/#document-resource-object-relationships) exist between `JsonapiEntity`s, and come in two broad flavours: to-one relationships can have zero or one values; to-many relationships can have zero-to-many. These are used in slightly different ways, but share a decorator - `@relationship(options?: RelationshipOptions)`, which must be applied to a property within a `JsonapiEntity` subtype, and permits the following configuration options:

```typescript
export interface RelationshipOptions {
  allowUnresolvedIdentifiers?: boolean;
  name?: string;
}
```

- `allowUnresolvedIdentifiers` is used when we want to fetch entities without also including their relationships, but we want to retain the ability to fetch them later at our discretion. More on that below.

- `name` is optional. If you omit it, the property name within the class must exactly match the property name within the JSON:API representation. However, you can specify `name` to decouple these, and use a more natural name inside your application. This might be useful if your API uses a convention for naming that doesn't fit the application, e.g. snake-case property names: `myComplexRelationship` versus `my_complex_relationship`.

#### To-one relationships

We already have an example of a [to-one relationship](https://jsonapi.org/format/#crud-updating-to-one-relationships): `BlogPost.author`.

The crucial feature that marks it as "to-one" is that there is a single `JsonapiEntity` being referenced, rather than an array of `JsonapiEntity`s.

#### To-many relationships

[To-many relationships](https://jsonapi.org/format/#crud-updating-to-many-relationships) instead use an array of `JsonapiEntity`s. We already have an example: `BlogPost.tags`.

#### Unresolved identifiers

Both of our previous examples assume that we always want to fetch a `BlogPost` from the API with its `Authors` and `Tags` populated. This is a common use-case and is therefore the default for this library. However, there are scenarios where we may wish to fetch an entity, and only populate its relationships at a later point.

To retain relationship identifiers, you need to work a little harder. Let's alter our existing example to capture this extra work:

```typescript
@entity({ type: "blog_posts" })
export class BlogPost extends JsonapiEntity {
  @meta() createdDateTime: string;
  @attribute() title: string;
  @attribute() content: string;

  @relationship({ allowUnresolvedIdentifiers: true })
  author: OneUnresolvedIdentifierOr<Author>;

  @relationship({ allowUnresolvedIdentifiers: true })
  tags: ManyUnresolvedIdentifiersOr<Tag>;
}
```

Note that we must explicitly configure our `relationships({ allowUnresolvedIdentifiers: true })` to enable this functionality.

In these cases, when the API response contains the related-entities, they will be resolved exactly as before:

- `author` will be an `Author` instance
- `tags` will be a `Tag[]`, containing `Tag` instances

However, when the API response does not contain the related-entities, they will be resolved to a different type, called `UnresolvedIdentifier`

- `author` will be an `UnresolvedIdentifier` instance
- `tags` will be a `UnresolvedIdentifier[]`, containing `UnresolvedIdentifier` instances

We can now query the API to find our `BlogPost` entities without these relationships being "included", but still retain the capability to fetch them later if we should need to do so.

There is a function called `isUnresolvedIdentifier` for testing whether we have an `UnresolvedIdentifier` or a true `JsonapiEntity`.

This is a differentiator against some other libraries (e.g. [Yayson](https://github.com/confetti/yayson)), which drop the relationship information if the related-resource is unavailable.

### Meta properties

`meta` properties are not specific to an entity - they [can appear at many levels within JSON:API representations](https://jsonapi.org/format/#document-meta) - however they are available directly inside "resource objects", and are described thus:

> `meta`: a meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship.

This essentially means they are not part of the standard REST lifecycle - you cannot update `meta` properties when you send updates to the API. A common use-case is for derived or lifecycle properties - e.g. tracking when entities were created or last updated.

The `@meta(options?: MetaOptions)` decorator must be applied to a property within a `JsonapiEntity` subtype, and permits the following options:

```typescript
export interface MetaOptions {
  name?: string;
}
```

- `name` is optional. If you omit it, the property name within the class must exactly match the property name within the JSON:API representation. However, you can specify `name` to decouple these, and use a more natural name inside your application. This might be useful if your API uses a convention for naming that doesn't fit the application, e.g. snake-case property names: `myMetaProperty` versus `my_meta_property`.

### Links

[Links](https://jsonapi.org/format/#document-resource-object-links) are predominantly a JSON:API feature to describe links where JSON:API resources reside. However, they can be useful in an application, so this library supports them.

The `@link(options?: LinkOptions)` decorator must be applied to a property within a `JsonapiEntity` subtype, and permits the following options:

```typescript
export interface LinkOptions {
  name?: string;
}
```

- `name` is optional. If you omit it, the property name within the class must exactly match the property name within the JSON:API representation. However, you can specify `name` to decouple these, and use a more natural name inside your application. This might be useful if your API uses a convention for naming that doesn't fit the application, e.g. snake-case property names: `myLinkProperty` versus `my_link_property`.

# FAQs

## Why can't I use Typescript `interfaces`?

Great question! Most Typescript code you write will use interfaces, not classes, because interfaces give all the advantages for type-safety, but are removed at runtime so don't have any consequence for your application bundle size. For this reason, interfaces tend to be preferred over classes in Typescript applications.

However, there are sometimes reasons to prefer classes over interfaces. Classes allow you to attach additional behaviours - such as decorators. It's not possible to use decorators with interfaces _because_ they don't exist at runtime.

JSON:API serialisation is also an additional behaviour. If you were to use interfaces for your types, you'd still need to incur the costs of declaring whatever performs the serialisation - this library just takes the approach of binding this serialisation directly to the types, and therefore you need to use classes.

## Why did we need another library?

At the time this library was initially developed, we were building an Angular application that needed JSON:API, and we initially started using Yayson. Yayson is solid, well-established, and better-supported than this
library.

However, we encountered a few specific issues in our use-cases that did not work with Yayson.

First, Yayson retains a single "store" of entities that it has deserialised (`sync`ed). The main implication of this is that the library encapulates its own state, and this is out of the developer's control. This library follows a functional pattern (pure functions, without internal state), so you can maintain your own state and pass it into serialisation functions as required. You can also implement a single store to sync against, should you prefer that.

Second, if Yayson cannot resolve a relationship to an entity, the information of that relationship (type/ID) is simply discarded. We wanted a little more control of that, where we could make a request for a JSON:API entity and be able to attach it to resources from a follow-up request. This use-case is therefore supported: if you want to keep relationship identifiers around, look for `UnresolvedIdentifiers`.

# Migrations and breaking changes

Please see the [CHANGELOG](CHANGELOG)
