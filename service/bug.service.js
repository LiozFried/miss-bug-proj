import { makeId, readJsonFile, writeJsonFile } from './util.service.js'
import { loggerService } from './logger.service.js'

export const bugService = {
    query,
    save,
    getById,
    remove,
    getEmptyBug,
    getTotalCount,
}

const bugs = readJsonFile('./data/bug.json')

const DISPLAY_BUGS_IN_PAGE = 4
// let totalPages = null

function query(filter, sort, page) {
    let bugToDisplay = bugs

    if (filter.txt) {
        const regExp = new RegExp(filter.txt, 'i')
        bugToDisplay = bugToDisplay.filter(bug => regExp.test(bug.title)
            || regExp.test(bug.description)
            || bug.labels.some(label => regExp.test(label)))
    }

    if (filter.minSeverity) {
        bugToDisplay = bugToDisplay.filter(bug => bug.severity >= filter.minSeverity)
    }

    if (sort.sortBy) {
        if (['severity', 'createdAt'].includes(sort.sortBy)) {
            bugToDisplay.sort((a, b) =>
                (a[sort.sortBy] - b[sort.sortBy]) * sort.sortDir)
        } else {
            bugToDisplay.sort((a, b) =>
                (a[sort.sortBy].localeCompare(b[sort.sortBy] * sort.sortDir)))
        }
    }

    if (page.pageIdx !== undefined) {
        const startIdx = page.pageIdx * DISPLAY_BUGS_IN_PAGE
        bugToDisplay = bugToDisplay.slice(startIdx, startIdx + DISPLAY_BUGS_IN_PAGE)
    }

    // totalPages = Math.floor(bugToDisplay / DISPLAY_BUGS_IN_PAGE)
    // let pageIdx = page.pageIdx
    // if (pageIdx < 0) pageIdx = totalPages - 1
    // if (pageIdx >= totalPages) pageIdx = 0
    // let startIdx = pageIdx * DISPLAY_BUGS_IN_PAGE
    // const endIdx = startIdx + DISPLAY_BUGS_IN_PAGE
    // bugToDisplay = bugToDisplay.slice(startIdx, endIdx)

    return Promise.resolve(bugToDisplay)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)

    if (!bug) {
        loggerService.error(`Couldnt find bug ${bugId} in bugService`)
        return Promise.reject('Cannot get bug')
    }

    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugs()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[idx] = { ...bugs[idx], ...bugToSave }

    } else {
        bugToSave._id = makeId()
        // bugToSave.createdAt = Date.now()
        bugs.push(bugToSave)
    }
    return _saveBugs().then(() => bugToSave)
}

function getTotalCount() {
    return Promise.resolve(totalPages)
}

function getEmptyBug({ title = '', description = '', severity = "", labels = [] }) {
    return {
        title,
        description,
        severity,
        createdAt: Date.now(),
        labels
    }
}

function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}