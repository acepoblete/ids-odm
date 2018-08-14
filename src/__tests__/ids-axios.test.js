import axios from 'axios'

const __env = process.env
const mockEnv = () => {
    process.env.IRIS_IDS_SERVER_URL = 'dis-url'
    process.env.IRIS_AUM_APP_KEY = 'foo'
    process.env.IRIS_AUM_APP_SECRET = 'bar'
    process.env.IRIS_AUM_SERVER_URL = 'aum-url'
    process.env.IRIS_IDS_USERID = 'userId'
}

import * as IdsAxios from '../ids-axios'
import * as aum from '../aum'

jest.mock('../aum', () => ({
    getAuthorizationHeader: jest.fn(() => Promise.resolve('authtoken')),
    getTraceId: jest.fn(() => 'traceid')
}))



describe('ids-axios', () => {

    beforeEach(() => {
        jest.resetModules();
        mockEnv()
    })

    afterEach(() => {
        process.env = { ...__env }
    })

    describe('IdsAxios.requestInterceptor()', () => {
        it('doctors up the axios config with all the things', async () => {

            const axiosConfig = { headers: {}, url: 'base' }

            const config = await IdsAxios.requestInterceptor(axiosConfig)
            expect(config.headers.Authorization).toBe('authtoken')
            expect(config.headers['trace-id']).toBe('traceid')
            expect(config.url).toBe(`base/userid/userId`)
        })
    })

    describe('IdsAxios.responseErrorInterceptor()', () => {
        it('throws errors that are not related to auth or 401s', async () => {

            try {
                const error = 'theerror'
                await IdsAxios.responseErrorInterceptor(error)
            } catch (err) {
                expect(err).toBe('theerror')
            }
        })

        describe('when ids returns 401', () => {

            it('calls aum.getAuthorizationHeader(true) to grab another jwt', async () => {

                aum.default.getAuthorizationHeader = jest.fn(() => 'yolo!!!')

                const error = {
                    response: { status: 401 },
                    config: { headers: {} }
                }

                const results = await IdsAxios.responseErrorInterceptor(error)

                expect(results.headers.Authorization).toBe('yolo!!!')
                expect(results.__isRetryRequest).toBe(true)
                expect(aum.default.getAuthorizationHeader).toHaveBeenCalledTimes(1)
                expect(aum.default.getAuthorizationHeader).toBeCalledWith(true)
            })
        })
    })

    describe('IdsAxios.responseSuccessInterceptor()', () => {
        it('successfully returns results', async () => {
            const data = 'thedata'
            const results = IdsAxios.responseSuccessInterceptor(data)
            expect(results).toBe(data)
        })
    })

    describe('IdsAxios.getPath()', () => {
        it('takes what we pass it and makes it into path', () => {
            expect(IdsAxios.getPath('one', 'two', 'three')).toBe('/one/two/three')
        })
    })

    describe('IdsAxios.transformResults()', () => {
        it('when ids returns a 204 return undefined', () => {
            const payload = {
                status: 204
            }

            const results = IdsAxios.transformResults(payload)

            expect(results).toBe(undefined)
        })

        it('any other status other then 204 return data', () => {
            const payload = {
                status: 200,
                data: 'thedata'
            }

            const results = IdsAxios.transformResults(payload)

            expect(results).toBe('thedata')
        })
    })

    describe('IdsAxios.sanitize()', () => {
        it('makes sure that special ids keys are not in the payload', () => {

            const payload = {
                objectId: 'xxxxxxx',
                safeData: 'safe',
                createdAt: 8,
                updatedAt: 0
            }

            const response = IdsAxios.sanitize(payload)

            expect(response.objectId).toBe(undefined)
            expect(response.createdAt).toBe(undefined)
            expect(response.updatedAt).toBe(undefined)
            expect(response.safeData).toBe('safe')
        })
    })

    describe('IdsAxios.http', () => {
        it('creates a new axios instance with baseUrl', () => {
            expect(IdsAxios.http.defaults.baseURL).toBe(process.env.IRIS_IDS_SERVER_URL)
        })
    })

    describe('IdsAxios.create', () => {
        it('pokes the axios post method with the right url data', async () => {

            const collectionName = 'collection'
            const payload = { data: 'thedata' }

            await IdsAxios.create(collectionName, payload)

            expect(axios.post).toBeCalledWith(`/classes/${collectionName}`, payload)

        })
    })

    describe('IdsAxios.update', () => {
        it('pokes the axios put method with the right url data', async () => {

            const collectionName = 'collection'
            const id = 'theId'
            const payload = { data: 'thedata' }

            await IdsAxios.update(collectionName, id, payload)

            expect(axios.put).toBeCalledWith(`/classes/${collectionName}/${id}`, payload)

        })
    })

    describe('IdsAxios.createOrUpdate', () => {
        it('pokes the axios put method with the right url data', async () => {

            const collectionName = 'collection'
            const query = { query: 'string' }
            const payload = { data: 'thedata' }

            await IdsAxios.createOrUpdate(collectionName, query, payload)

            expect(axios.put).toBeCalledWith(`/classes/${collectionName}`, {
                query,
                object: payload
            })

        })
    })

    describe('IdsAxios.count', () => {
        it('pokes the axios get method with the right url data', async () => {

            const collectionName = 'collection'

            await IdsAxios.count(collectionName)

            expect(axios.get).toBeCalledWith(`/classes/${collectionName}/count`)

        })
    })

    describe('IdsAxios.get', () => {
        it('pokes the axios get method with the right url data', async () => {

            const collectionName = 'collection'
            const id = 'theid'

            await IdsAxios.get(collectionName, id)

            expect(axios.get).toBeCalledWith(`/classes/${collectionName}/${id}`)

        })
    })

    describe('IdsAxios.all', () => {
        it('pokes the axios get method with the right url data', async () => {

            const collectionName = 'collection'

            await IdsAxios.all(collectionName)

            expect(axios.get).toBeCalledWith(`/classes/${collectionName}`)

        })
    })

    describe('IdsAxios.query', () => {
        it('pokes the axios get method with the right url data', async () => {

            const collectionName = 'collection'
            const query = { data: 'string' }

            await IdsAxios.query(collectionName, query)

            expect(axios.post).toBeCalledWith(`/query/${collectionName}`, {
                query
            })

        })
    })

    describe('IdsAxios.destroy', () => {
        it('pokes the axios delete method with the right url data', async () => {

            const collectionName = 'collection'
            const id = 'theid'

            await IdsAxios.destroy(collectionName, id)

            expect(axios.delete).toBeCalledWith(`/classes/${collectionName}/${id}`)

        })
    })
})