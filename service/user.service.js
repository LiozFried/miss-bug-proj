import fs from 'fs'
import { readJsonFile } from './util.service.js'
import { use } from 'react'

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

function getById(userId) {
    var user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')

    user = { ...user }
    delete user.password

    return Promise.resolve(user)
}