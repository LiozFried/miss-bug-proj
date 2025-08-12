const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.remote.js"
import { userService } from "../services/user.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadUserBugs()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                navigate('/')
            })
    }

    function loadUserBugs() {
        bugService.query({ userId: params.userId })
            .then(res => {
                setUserBugs(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                setUserBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('from remove bug', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        if (!severity) return alert('Please enter a severity')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                setUserBugs(prevBugs =>
                    prevBugs.map(currBug =>
                        currBug._id === savedBug._id ? savedBug : currBug
                    )
                )
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('from edit bug', err)
                showErrorMsg('Cannot update bug')
            })
    }

    if (!user) return <div>Loading...</div>

    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            {!userBugs || (!userBugs.length && <h2>No bugs to show</h2>)}
            {userBugs && userBugs.length > 0 && <h3>Manage your bugs</h3>}
            <BugList bugs={userBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            <Link to="/">Back Home</Link>
        </section>
    )
}