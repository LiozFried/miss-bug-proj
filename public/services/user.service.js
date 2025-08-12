const BASE_URL = '/api/user/'

export const userService = {
    query,
    getById,
    getEmptyCredentials,
}

function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}