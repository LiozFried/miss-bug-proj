import fs from 'fs'
import { readJsonFile } from './util.service.js'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    add,
}

const users = readJsonFile('data/user.json')

function query() {
    const usersToReturn = users.map(user => ({ _id: user._id, fullname: user.fullname }))
    return Promise.resolve(usersToReturn)
}