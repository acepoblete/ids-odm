# IDS ODM

Super simple document manager for IDS heavily influenced by Laravel's Eloquent ORM.

```
import { IdsDocument } from 'ids-odm'

export default class Foo {
    collectionName = 'Foo' 
    properties = {
        // properties as defined in json schema
        bar: {
            type: 'string'
        }
    }
}

...

try {
    // create an instance
    const x = new Foo()
    // set properties 
    x.bar = 'yolo'
    // save it
    await x.save()
} catch (err) {
    // if validation fails err 
    // will be an array of ajv errors
    console.error("foo bar didn't pass validation")
}
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





