import { makeId, readJsonFile, writeJsonFile } from './util.service.js'
import { loggerService } from './logger.service.js'

const bugs = readJsonFile('./data/bug.json')

export const bugService = {
    query,
    save,

}

function query() {
    return Promise.resolve(bugs)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[idx] = { ...bugs[idx], ...bugToSave }

    } else {
        bugToSave._id = makeId()
        bugToSave.createdAt = Date.now()
        bugs.push(bugToSave)
    }
    return _saveBugs().then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}