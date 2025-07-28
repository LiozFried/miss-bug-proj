import express from 'express'

import { bugService } from './service/bug.service.js'
import { loggerService } from './service/logger.service.js'

const app = express()

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {

    loggerService.debug('req.query', req.query)

    const { title, description, severity, _id } = req.query
    console.log('req.query', req.query)
    const bug = {
        _id,
        title,
        description,
        severity: +severity,
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

app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/bug/:id/remove', (req, res) => {
    const bugId = req.params.id

    bugService.remove(bugId)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`bug ${bugId} deleted`)
        })
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))