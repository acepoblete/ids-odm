import axios from 'axios'
import * as aum from '../aum'

const __base64FooBar = 'Zm9vOmJhcg=='
const __traceId = 'IDS-ODM:trace-id'
const __basicAuthorizationToken = `Basic ${__base64FooBar}`
const __env = process.env

jest.mock('uuid', () => ({ v1: jest.fn(() => 'trace-id') }))

jest.mock('axios')

describe('aum wrapper', () => {

    beforeEach(() => {
        jest.resetModules();
        process.env.IRIS_AUM_APP_KEY = 'foo'
        process.env.IRIS_AUM_APP_SECRET = 'bar'
        process.env.IRIS_AUM_SERVER_URL = 'aum-url'
    })

    afterEach(() => {
        process.env = { ...__env }
    })

    describe('aum.getTraceId()', () => {
        it('returns string with uuid', () => {
            expect(aum.getTraceId()).toBe(__traceId)
        })
    })

    describe('aum.base64Encode()', () => {
        it('it creates a base64 string from env arguments', () => {
            expect(aum.base64Encode()).toBe(__base64FooBar)
        })
    })

    describe('aum.getAumJwt()', () => {
        it('calls axios with the right params', async () => {

            axios.post.mockImplementation(() => Promise.resolve({
                data: {
                    Token: 'yolo'
                }
            }))

            const token = await aum.getAumJwt()
            expect(token).toBe('yolo')
            expect(axios.post).toBeCalledWith(
                'aum-url/login/',
                { "Type": "Server" },
                {
                    headers: {
                        "trace-id": __traceId,
                        Authorization: __basicAuthorizationToken
                    }
                })
        })

        it('throws an exception when axios erros out', async () => {

            try {
                axios.post.mockImplementation(() => Promise.reject({
                    err: 'yolo'
                }))
                await axios.post()

            } catch (err) {
                expect(err).toEqual({
                    err: 'yolo',
                })
            }

        })
    })

    describe('aum.getAuthorizationHeader()', () => {
        
        it('fetches a new jwt from aum', async () => {

            aum.__.getAumJwt = jest.fn(() => 'foobar')

            const token = await aum.getAuthorizationHeader()
            expect(token).toBe('Bearer foobar')

        })

        it('returns from cache the 2nd time through', async () => {

            aum.__.getAumJwt = jest.fn()

            const token = await aum.getAuthorizationHeader()
            expect(aum.__.getAumJwt).toHaveBeenCalledTimes(0)

        })

        it('fetches a new jwt when you poison the cache', async () => {

            aum.__.getAumJwt = jest.fn(() => "thats not a knife")

            const token = await aum.getAuthorizationHeader(true)
            expect(token).toBe('Bearer thats not a knife')
            expect(aum.__.getAumJwt).toHaveBeenCalledTimes(1)

        })
    })
})