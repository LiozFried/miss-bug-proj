const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = '/api/auth/'

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser,
}