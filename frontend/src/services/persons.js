import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return returnData(axios.get(baseUrl))
}

const create = newObject => {
    return returnData(axios.post(baseUrl, newObject))
}

const remove = id => {
    return returnData(axios.delete(`${baseUrl}/${id}`))
}

const update = updatedObject => {
    return returnData(axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject))
}

const returnData = (request) => {
    return request.then(response => response.data)
}

export default { getAll, create, remove, update }