import path from 'path'

import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './service/bug.service.js'
import { loggerService } from './service/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {

    const { txt, sortBy, sortDir, minSeverity, pageIdx } = req.query

    const filter = {
        txt: txt || '',
        minSeverity: parseInt(minSeverity) || 0
    }

    const sort = {
        sortBy,
        sortDir: parseInt(sortDir) || 1
    }

    const page = {
        pageIdx: parseInt(pageIdx) || 0
    }

    bugService.query(filter, sort, page)
        .then(bugs => {
            res.send(bugs)
        })
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/totalBugs', (req, res) => {

    bugService.getTotalCount()
        .then((count) => {
            res.status(200).json(count)
        })
        .catch((err) => {
            loggerService.error('Cannot get total bugs', err)
            res.status(503).send('Cannot get total bugs')
        })
})

app.get('/api/bug/:id', (req, res) => {

    const bugId = req.params.id

    let visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length > 3) {
        return res.status(401).send('Wait for a bit')
    }

    visitedBugs = [...visitedBugs, bugId]
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.put('/api/bug/', (req, res) => {

    loggerService.debug('req.body', req.body)

    const { title, description, severity, _id } = req.body

    const bug = {
        _id,
        title,
        description,
        severity: +severity
    }

    bugService.save(bug)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.post('/api/bug/', (req, res) => {

    loggerService.debug('req.body', req.body)
    const bug = bugService.getEmptyBug(req.body)

    bugService.save(bug)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.delete('/api/bug/:id', (req, res) => {
    const bugId = req.params.id

    bugService.remove(bugId)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`bug ${bugId} deleted`)
        })
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))