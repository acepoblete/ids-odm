import IdsDocument from '../ids-document'
import * as idsProxy from '../ids-proxy'
import * as idsAxios from '../ids-axios'

jest.mock('../ids-proxy')
jest.mock('../ids-axios', () => ({
    create: jest.fn(() => Promise.resolve({ status: 200, data: { the: 'data' } })),
    update: jest.fn(() => Promise.resolve({ status: 200, data: { the: 'data' } })),
    delete: jest.fn(() => Promise.resolve({ status: 200, data: { the: 'data' } })),
    query: jest.fn(() => Promise.resolve({ status: 200, data: { the: 'data' } })),
    all: jest.fn(() => Promise.resolve({ status: 200, data: { the: 'data' } })),
}))

describe('IdsDocument', () => {

    describe('instance methods', () => {

        it('wip', () => {})

        // describe('save()', () => {

        //     it('calls update when we have an id', async () => {

        //         const document = new IdsDocument({ id: 'yolo' })
        //         const spyUpdate = jest.spyOn(document, 'update')
        //         const spyInsert = jest.spyOn(document, 'insert')

        //         await document.save()

        //         expect(spyUpdate).toHaveBeenCalledTimes(1)
        //         expect(spyInsert).not.toHaveBeenCalled()
        //     })

        //     it('calls insert when we dont have an id', async () => {

        //         const document = new IdsDocument()
        //         const spyUpdate = jest.spyOn(document, 'update')
        //         const spyInsert = jest.spyOn(document, 'insert')

        //         await document.save()

        //         expect(spyInsert).toHaveBeenCalledTimes(1)
        //         expect(spyUpdate).not.toHaveBeenCalled()
        //     })

        // })
    })
})