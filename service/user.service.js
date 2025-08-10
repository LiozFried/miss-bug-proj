import fs from 'fs'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    add,
}

function query() {
    const usersToReturn = users.map(user => ({ _id: user._id, fullname: user.fullname }))
    return Promise.resolve(usersToReturn)
}