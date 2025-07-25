import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const bugs = readJsonFile('./data/bug.json')

export const bugService = {
    query,

}

function query() {
    return Promise.resolve(bugs)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)

        if (idx === -1) {
            return Promise.reject('Couldnt save')
        }

        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = makeId()
        bugs.push(bugToSave)
    }

    return _saveBugs()
        .then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}