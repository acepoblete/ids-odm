# IDS ODM

Super simple document manager for IDS heavily influenced by Laravel's Eloquent ORM.  

Under the hood the object is making use of AJV schema for validation.  The only required properties needed to get you up and running are the collectionName and the properties props.  Both are used with AJV to create a json schema that is used during validation.


Javascript Proxy's are used to replicate PHP's *magic methods* api.  All your json data is proxied to an internal property attributes.  This basically allows us to treat the object as if we have defined each property with getters and setters on our object.


```
import { IdsDocument } from 'ids-odm'

export default class Foo {
    collectionName = 'Foo' 
    properties = {
        // properties as defined in json schema
        bar: {
            type: 'string'
        }, 
        age: {
            type: 'number'
        }
    }
}

...
// create an instance
const x = new Foo()
// set properties 
x.bar = 'yolo'
// save it
await x.save()

...
// find it by id
const x = await Foo.find(id) 
// update the db
x.age = 21
await z.update()

// find it by id's
const docs = await Foo.find([id, id2]) 
// update the db
docs.forEach(d => console.log(d.toJSON()))

...
// query ids
const docs = await Foo.query({ age:{ '$gte' : 21 } })
docs.forEach(d => console.log(d.toJSON()))

...
// delete from ids
await Foo.destroy('uuid from ids')

...
// dump your collection
const all = await Foo.all()

```

# API

## Static Methods

### create({})

### find(id)

### destroy(id)

### query({})

### all()

## Instance Methods (public)

### save()

### insert() 

### update() 

### delete() 

## Instance Methods (private)

### _query({})

### _all()

### _findById(id)

### _findByIds(ids)





