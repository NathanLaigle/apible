# About Apible

Apible is a simple lib, based on axios, that performs basic http requests on REST API. To use an Apible instance,
just provide a typed entity to Apible instance like below.

```
import { Apible } from 'apible';

type Entity = {
  name: string;
  id?: number;
};

const apible = new Apible<Entity>();
```

The created apible instance will provide the following methods :

- [getAll](#getAll)
- [getOne](#getAll)
- [create](#create)
- [update](#update)
- [delete](#delete)

An RXJS subject will also be provided. This subject, named [events](#events), will emit all
interactions made by apible instance. It can be usefull to detect potential changes on the API and use
some callback actions in your front-end.

# getAll

Performs a GET request.

**Simple use:**

```
const response: Entity[] = await apible.getAll(`http://localhost:3000/entity`);
```

**Add filters:**

```
const response: Entity[] = await apible.getAll(`http://localhost:3000/entity`, {
    queryFilters : {
        name : 'nathan',
        anyKey: 'anyOtherInformation'
    }
});
```

Filters will be added as query params (example : 'http://localhost:3000/entity?name=nathan&anyKey=anyOtherInformation');

# getOne

Performs a GET request.

**Simple use:**

```
const response: Entity = await apible.getOne(`http://localhost:3000/entity`, 1);
```

The entity's identifier will be added as a path parameter (example : 'http://localhost:3000/entity/1')

# create

Performs a POST request.

**Simple use:**

```
const response: Entity = await apible.create(`http://localhost:3000/entity`, {name : 'nathan'});
```

# update

Performs a PATCH request.

**Simple use:**

```
const entity: Entity = await apible.getOne(
    `http://localhost:3000/entity`, 1
);

entity.name = 'updated name';

const response: UpdateResponse = await apible.update<UpdateResponse>(
    `http://localhost:3000/entity`,
    entity
);
```

_UpdateResponse_ can be anything. You can type the update response to fit the requested api.

# delete

Performs a DELETE request.

**Simple use:**

```
const response: DeleteResponse = await apible.delete<DeleteResponse>(`http://localhost:3000/entity`, 1);
```

The entity's identifier will be added as a path parameter (example : 'http://localhost:3000/entity/1'). _DeleteResponse_ can be anything. You can type the delete response to fit the requested api.

# events

Subscribe to the events subject by using RXJS subscribe method :

```
apible.events.subscribe((event : ResourceInteractionEvent<Entity>) => {
    // do anything
})
```

Interactions are objects that give information on the action performed by the apible instance. Here is an example :

```
{
    type: 'delete',
    resource: {id: 1},
    metaData: ['any', 'custom', 'information']
}
```

**type** could be : 'create', 'delete', 'update' or 'get'.
**resource** is the data you are handling. (note that for a create type, the event cannot return resource's id if it has not been specified in the created resource. Event is thrown before any API response).
**metaData** is a string or an array of strings that you can feed when you use any of the apible methods

To specify interaction rules when you are making a request with apible, you pass an object with custom settings like below.

```
const createdEntity: Entity = await apible.create(
    `http://localhost:3000/entity`,
    { name: 'nathan' },
    {
        customInteractionMetaData : ['custom', 'metadata'],
        handleInteractivity: true
    }
);
```

Custom metadata can be use to improve events filters while subscribing to events subject. Here is an example:

```
import { Apible, ResourceInteractionEvent } from 'apible';
import { filter } from 'rxjs';

apible.events.pipe(filter(event => event.metaData.includes('custom'))).subscribe((event : ResourceInteractionEvent<Entity>) => {
    // do anything
});
```

By default create, delete and update methods emit events. But you can prevent them them from emitting anything by switching handleInteractivity to false in the methods options. for getOne and getAll, you can of course emit data by switching handleInteractivity to true, but be careful not to create infinite loops.
