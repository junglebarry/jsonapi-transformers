# Changelog

In which we discuss migrations and breaking changes. This is manually-maintained; for a commit-flavour changelog, please look at [releases](releases).

## From 3.x to 4.x

For v4, we are removing support for the deprecated v2 use of constructor parameters for property initialisation. With the change to target MJS and CJS outputs, we now have tests that showcase this behaviour breaking, and therefore are officially removing support.

The recommended format for object initialisation is this:

```typescript
const david = Author.create({
  id: "david",
  name: "David Brooks",
  lastLoginDateTime: "2021-07-24T11:00:00.000Z",
});
```

## From 2.x to 3.x

The 2.x release line includes a breaking change to allow properties to be partially-specified via the constructor parameter. Unfortunately, this did not work in all cases because subclass properties are assigned after supertype constructors are executed, meaning the change did not work properly in all cases.

We have therefore deprecated the use of constructor parameters with v3, meaning this v2 code:

```typescript
// DON'T DO THIS, IT'S DEPRECATED AND THERE IS NO GUARANTEE IT WILL WORK
const david = new Author({
  id: "david",
  name: "David Brooks",
  lastLoginDateTime: "2021-07-24T11:00:00.000Z",
});
```

must be rewritten as:

```typescript
const david = Author.create({
  id: "david",
  name: "David Brooks",
  lastLoginDateTime: "2021-07-24T11:00:00.000Z",
});
```

or:

```typescript
const david = newEntity(Author, {
  id: "david",
  name: "David Brooks",
  lastLoginDateTime: "2021-07-24T11:00:00.000Z",
});
```

or the original format:

```typescript
const david = new Author();
david.id = "david";
david.name = "David Brooks";
david.lastLoginDateTime = "2021-07-24T11:00:00.000Z";
```

The v2 format may still work for you, but you are recommended to avoid it, and consider it deprecated:

```typescript
// DON'T DO THIS, IT'S DEPRECATED AND THERE IS NO GUARANTEE IT WILL WORK
const david = new Author({
  id: "david",
  name: "David Brooks",
  lastLoginDateTime: "2021-07-24T11:00:00.000Z",
});
```

## From 1.x to 2.x

The 2.x release line includes a breaking change to allow properties to be partially-specified via the constructor parameter.

In practical terms this meant that:

```typescript
const david = new Author();
david.id = "david";
david.name = "David Brooks";
david.lastLoginDateTime = "2021-07-24T11:00:00.000Z";
```

could be rewritten as:

```typescript
const david = new Author({
  id: "david",
  name: "David Brooks",
  lastLoginDateTime: "2021-07-24T11:00:00.000Z",
});
```

Though the original format will still work.

However, to facilitate this, the default constructor for `JsonapiEntity` needed access to the type being instantiated:

```typescript
constructor(properties: Partial<E> = {})
```

where `E` must be the type in question.

In order to provide this, the `JsonapiEntity` subtype needed to be available to the constructor, and to achieve this, new `JsonapiEntity` subtypes must include the type as they extend that base type. In practice, this means that:

```typescript
@entity({ type: "authors" })
export class Author extends JsonapiEntity {
  @meta() lastLoginDateTime: string;
  @attribute() name: string;
}
```

must be rewritten as:

```typescript
@entity({ type: "authors" })
export class Author extends JsonapiEntity<Author> {
  // note the type parameter on the supertype
  @meta() lastLoginDateTime: string;
  @attribute() name: string;
}
```

As part of this change, we also moved `JsonapiEntity` into its own file, so imports of the form:

```typescript
import { JsonapiEntity } from "jsonapi-transformers/src/jsonapi/types";
```

will not work, and need to be migrated to:

```typescript
import { JsonapiEntity } from "jsonapi-transformers/src/jsonapi/jsonapi-entity";
```

However, we recommend importing from `'jsonapi-transformers'` rather than delving into the internal structure.
