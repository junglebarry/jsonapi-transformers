# jsonapi-transformers

This is a library for transforming between JSON:API responses and natural JSON objects.

Specifically, it:

* is a Typescript library
* allows natural JSON objects to be represented as Typescript classes
* supports serialisation of Typescript class instances to JSON:API and deserialisation back again JSON:API.

# Todo

- [ ] Work out distribution pattern and consumption from within a TS application
- [ ] Update tests and documented examples to be a neutral domain
- [ ] Configure as a CircleCI private project
- [ ] Install a code coverage tool and get test coverage to a reasonable level
- [ ] Document all functions and types
- [ ] Add references to other JSON:API libraries
- [ ] PR and code review
- [ ] v0.1

# Motivation

The motivation for this library is manifold:

* JSON:API is a relatively pleasant transmission format for JSON-over-HTTP;
* ... however, we wouldn't want to use the JSON:API format in application-level JSON;
* I've been doing a lot of Angular recently;
* There's no Ember-level support for JSON:API in Angular;
* I wanted a lightweight serialisation solution, not an ORM or something with networking (read: asynchrony) baked in;
* Existing lightweight serialisation solutions like Yayson work perfectly well in many use-cases, but, I found, not so well in mine.
* Angular is written in Typescript, which provides appropriate metaprogramming capabilities (and I wanted to experiment with them).

# What can you do?

Well, you can define Typescript classes, and have them serialise to JSON:API and deserialise from JSON:API.

## Entities and attributes

Imagine a Typescript interface representing the basics of an address:

```typescript
interface Address {
  houseNumber?: number;
  street: string;
  city: string;
  county?: string;
}
```

An example of this interface in JSON might be:


```json
{
  "houseNumber": 29,
  "street": "Acacia Road",
  "city": "Nuttytown"
}
```

and the counterpart in JSON:API might look like this:

```json
{
  "id": "29_acacia_road",
  "type": "addresses",
  "attributes": {
    "houseNumber": 29,
    "street": "Acacia Road",
    "city": "Nuttytown"
  }
}
```

So the question is, how can we map between the Typescript type and its JSON:API representation?

This library uses Typescript decorators to provide this, and for a number of reasons we target classes, not interfaces. Here's our example again:

```typescript
@entity({ type: 'addresses' })
export class Address extends JsonapiEntity {
  @attribute() houseNumber?: number;
  @attribute() street: string;
  @attribute() city: string;
  @attribute() county?: string;
}
```

There are a few things to note:

First, we used a Typescript class to define our type. It must extend `JsonapiEntity`, which ensures that our class provides the mandatory `id` and `type` attributes.

Second, the `@entity` decorator binds our class to a JSON:API entity type. Note that `entity` is a function accepting a JSON object as its sole argument, and the `type` (as it appears in the JSON:API entity definition) must be explicitly provided. This is how `jsonapi-transformers` connects the class with its serialised form.

Third, each class property that should be mapped to a JSON:API attribute uses the `@attribute` decorator. Again, this is a function accepting a JSON object as its sole argument. By default, the serialised attribute will have the same name as the class property (though this may be customised).

## Relationships

```typescript
/** @todo */
```

## Customising JSON property names

```typescript
/** @todo */
```

## Handling unresolved identifiers

```typescript
/** @todo */
```

# Specific isses encountered with Yayson

Yayson is perfectly fine, well-established, and better-supported than this library. You should almost certainly use it in favour of this library.  Indeed, I am using it, at least for the time being... However, since I've mentioned that I hit some stumbling blocks for my use cases, I'll draw them out here.

First, Yayson retains a single "store" of entities that it has deserialised (`sync`ed). The main implication of this is that the library encapulates its own state, and this is out of the developer's control. This library follows a functional pattern (pure functions, without internal state), so you can maintain your own state and pass it into the functions should you need it.

Second, if Yayson cannot resolve a relationship to an entity, the information of that relationship (type/ID) is simply discarded. I wanted a little more control of that, so this library makes that possible. If you want to keep relationship identifiers around, you can do so (look for `UnresolvedIdentifiers`).
