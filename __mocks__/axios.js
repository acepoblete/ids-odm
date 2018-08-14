import './process-env'

const axios = jest.genMockFromModule('axios');

axios.mockImplementation((config) => Promise.resolve(config))

axios.post = jest.fn((url, payload) => Promise.resolve({ status: 200, data: { ...payload, objectId: 'id' } }))
axios.put = jest.fn((url, payload) => Promise.resolve({ status: 200, data: payload }))
axios.get = jest.fn((url) => Promise.resolve({ status: 200, data: 'theresponse' }))
axios.delete = jest.fn((url) => Promise.resolve({ status: 200, data: 'theresponse' }))

axios.create = jest.fn(config => {
    return {
        ...axios,
        defaults: config,
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() }
        }
    }
})

export default axios;