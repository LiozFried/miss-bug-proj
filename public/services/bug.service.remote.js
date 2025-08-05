
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getTotalBugs
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)

    //  The previous way

    // .then(bugs => {

    //     if (filterBy.txt) {
    //         const regExp = new RegExp(filterBy.txt, 'i')
    //         bugs = bugs.filter(bug => regExp.test(bug.title))
    //     }

    //     if (filterBy.minSeverity) {
    //         bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
    //     }

    //     return bugs
    // })
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    const url = BASE_URL + bugId
    return axios.delete(url)
        .then(res => res.data)
        .catch(console.error)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug)
            .then(res => res.data)
            .catch(console.error)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
            .catch(console.error)
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, pageIdx: 0, sortBy: '', sortDir: 1 }
}

function getTotalBugs() {
    return axios.get(BASE_URL + 'totalBugs')
        .then(res => res.data)
        .catch(console.error)
}