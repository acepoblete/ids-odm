import IdsDocument from '../ids-document'
import * as idsProxy from '../ids-proxy'

jest.mock('../ids-proxy')

IdsDocument.prototype.constructor = jest.fn(x => x)

describe('IdsDocument', () => {

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        // IdsDocument.mockClear();
    });

    describe('constructor()', () => {

        it('calls _populate & wrap', () => {
            const mockObject = 'mock'
            const mockPopulate = jest.fn()
            IdsDocument.prototype._populate = mockPopulate

            const document = new IdsDocument(mockObject)

            expect(mockPopulate).toHaveBeenCalledTimes(1)
            expect(mockPopulate).toBeCalledWith(mockObject)
            expect(idsProxy.wrap).toHaveBeenCalledTimes(1)

        })
    })

    describe('static methods', () => {
        
        beforeEach(() => {
            IdsDocument.prototype.constructor.mockClear()
        })

        describe('create()', () => {

            it('news up instance, calls save, returns instance', async () => {
                const mockObject = { foo: 'bar' }
                IdsDocument.prototype.constructor.mockImplementation(x => Object.assign(x, { save: jest.fn(x => Promise.resolve(x)) }))

                const document = await IdsDocument.create(mockObject)

                expect(document.save).toHaveBeenCalledTimes(1)
            })

        })

        describe('find()', () => {

            let mockFind

            beforeEach(() => {
                mockFind = {
                    _findByIds: jest.fn(() => Promise.resolve()),
                    _findById: jest.fn(() => Promise.resolve())
                }
                IdsDocument.prototype.constructor.mockImplementation(() => mockFind)
            })

            it('given array calls _findByids', async () => {
                const mockObject = [1, 2]

                await IdsDocument.find(mockObject)

                expect(mockFind._findByIds).toHaveBeenCalledTimes(1)
                expect(mockFind._findByIds).toBeCalledWith(mockObject)
                expect(mockFind._findById).not.toBeCalled()
            })

            it('given string calls _findByid', async () => {
                const mockObject = "id"

                await IdsDocument.find(mockObject)

                expect(mockFind._findById).toHaveBeenCalledTimes(1)
                expect(mockFind._findById).toBeCalledWith(mockObject)
                expect(mockFind._findByIds).not.toBeCalled()
            })

        })

        describe('destroy()', () => {

            let mockFind

            beforeEach(() => {
                mockFind = {
                    delete: jest.fn(() => Promise.resolve())
                }
                IdsDocument.prototype.constructor.mockImplementation(() => mockFind)
            })

            it('news up the an instance and calls delete', async () => {
                const mockObject = "id"

                await IdsDocument.destroy(mockObject)

                expect(mockFind.delete).toHaveBeenCalledTimes(1)
            })
        })

        describe('query()', () => {

            let mockFind

            beforeEach(() => {
                mockFind = {
                    _query: jest.fn(() => Promise.resolve())
                }
                IdsDocument.prototype.constructor.mockImplementation(() => mockFind)
            })

            it('news up the an instance and calls delete', async () => {
                const mockObject = "id"

                await IdsDocument.query(mockObject)

                expect(mockFind._query).toHaveBeenCalledTimes(1)
            })
        })

        describe('all()', () => {

            let mockFind

            beforeEach(() => {
                mockFind = {
                    _all: jest.fn(() => Promise.resolve())
                }
                IdsDocument.prototype.constructor.mockImplementation(() => mockFind)
            })

            it('news up the an instance and calls all', async () => {

                await IdsDocument.all()

                expect(mockFind._all).toHaveBeenCalledTimes(1)
            })
        })
    })
})