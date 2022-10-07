# About Apible

Apible is a simple lib, based on axios, that performs basic http requests on REST API. To use an Apible instance,
just provide a typed entity to Apible instance create like below.

```
type Entity = {
  name: string;
  id?: number;
};

const apible = new Apible<Entity>();
```

The created apible instance will provide the following methods :

- [getAll](#getAll)
- getOne
- create
- update
- delete

An RXJS subject will also be provided. This subject, named [events](#events), will emit all
interactions made by apible instance. It can be usefull to detect potential changes on the API and use
some callback actions in your front-end.

# getAll

## Simple use:

```
const response: Entity[] = await apible.getAll(`http://localhost:3000/entity`);
```

## Add filters:

```
const response: Entity[] = await apible.getAll(`http://localhost:3000/entity`, {
    queryFilters : {
        name : 'nathan',
        anyKey: 'anyOtherInformation'
    }
});
```

Filters will be added as query params (example : "http://localhost:3000/entity?name=nathan&anyKey=anyOtherInformation");

# getOne

## Simple use:

```
const response: Entity = await apible.getOne(`http://localhost:3000/entity`, 1);
```

The entity's identifier will be added as a path parameter (example : "http://localhost:3000/entity/1")
