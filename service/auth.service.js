import Cryptr from 'cryptr'
import { userService } from './user.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-password-1234')

export const authService = {
    checkLogin,
    getLoginToken,
    validateToken,
}