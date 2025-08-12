const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = '/api/auth/'

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser,
}

function login({ username, password }) {
    return axios.post(BASE_URL + 'login', { username, password })
        .then(res => res.data)
        .then(_setLoggedinUser)
}



function _setLoggedinUser(user) {
    const { _id, fullname, isAdmin } = user
    const userToSave = { _id, fullname, isAdmin}

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}