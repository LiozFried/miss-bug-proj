import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const bugs = readJsonFile('./data/bug.json')

export const bugService = {
    query,

}

function query() {
    return Promise.resolve(bugs)
}