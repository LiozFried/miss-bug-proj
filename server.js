import path from 'path'

import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './service/bug.service.js'
import { userService } from './service/user.service.js'
import { loggerService } from './service/logger.service.js'
import { authService } from './service/auth.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {

    const { txt, sortBy, sortDir, minSeverity, pageIdx, userId } = req.query

    const filter = {
        txt: txt || '',
        minSeverity: parseInt(minSeverity) || 0,
        userId: userId || ''
    }

    const sort = {
        sortBy,
        sortDir: parseInt(sortDir) || 1
    }

    const page = {
        pageIdx
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
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    loggerService.debug('req.body', req.body)

    const { title, description, severity, _id } = req.body

    const bug = {
        _id,
        title,
        description,
        severity: +severity
    }

    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.post('/api/bug/', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    loggerService.debug('req.body', req.body)
    const bug = bugService.getEmptyBug(req.body)
    delete loggedinUser.username
    bug.creator = loggedinUser

    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.delete('/api/bug/:id', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')

    const bugId = req.params.id

    bugService.remove(bugId, loggedinUser)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`bug ${bugId} deleted`)
        })
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/:id', (req, res) => {
    const { loginToken } = req.cookies
    const loggedinUser = authService.validateToken(loginToken)

    if (!loggedinUser || !loggedinUser.isAdmin) return res.status(401).send('Cannot remove user')
    const { userId } = req.params

    userService.remove(userId)
        .then(() => res.send('Removed!'))
        .catch(err => {
            loggerService.error('Cannot delete user!', err)
            res.status(401).send('Cannot delete user!')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => res.status(404).send('Invalid Credentials'))
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.addUser(credentials)
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(() => res.status(400).send('Username taken'))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))