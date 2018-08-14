import IdsDocument from '../'

export default class MyClass {

    collectionName = 'MyCollectionName'
    properties = {
        "name": {
            "$id": "/properties/name",
            "type": "string",
            "title": "The Name Schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "A green door"
            ]
        },
        "age": {
            "$id": "/properties/price",
            "type": "number",
            "title": "The Price Schema",
            "description": "An explanation about the purpose of this instance.",
            "default": 0,
            "examples": [
                21
            ]
        }
    }
}

(async () => {

    // create a new document
    const doc = await MyClass.create({ name: 'Jon Doe', age: 44 })

    // find that document by id
    const x = await MyClass.findById(doc.id)

    // update document attributes
    x.name = 'Foo Bar'
    x.age = 88
    // save changes
    await x.save()

    // get documents by query
    const q = await MyClass.query({ name: 'Foo Bar' })

    // delete 
    q.delete()

})()