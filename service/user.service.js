import fs from 'fs'
import { readJsonFile, makeId } from './util.service.js'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    addUser,
}

let users = readJsonFile('data/user.json')

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

function getByUsername(username) {
    var user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function remove(userId) {
    users = users.filter(user => user._id !== userId)
    return _saveUserToFile()
}

function addUser(user) {
    return getByUsername(user.username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            user._id = makeId()
            users.push(user)

            return _saveUserToFile()
                .then(() => {
                    user = { ...user }
                    delete user.password
                    return user
                })
        })
}

function _saveUserToFile() {
    return new Promise((resolve, reject) => {
        const userStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', userStr, err => {
            if (err) {
                return console.log(err)
            }
            resolve()
        })
    })
}