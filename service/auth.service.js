import Cryptr from 'cryptr'
import { userService } from './user.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-password-1234')

export const authService = {
    checkLogin,
    getLoginToken,
    validateToken,
}

function checkLogin({ username, password }) {
    return userService.getByUsername(username)
        .then(user => {
            if (user && user.password === password) {

                const userToReturn = {
                    _id: user._id,
                    fullname: user.fullname,
                    isAdmin: user.isAdmin
                }
                return Promise.resolve(userToReturn)
            }
            return Promise.reject()
        })
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    if (!token) return null

    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}