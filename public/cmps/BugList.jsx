const { Link } = ReactRouterDOM

import { authService } from '../services/auth.service.js'
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    const loggedinUser = authService.getLoggedinUser()

    function isCreator(bug) {
        if (!loggedinUser) return false
        if (!bug.creator) return true
        return loggedinUser.isAdmin || bug.creator._id === loggedinUser._id
    }

    if (!bugs) return <div>Loading...</div>

    return (
        <ul className="bug-list">
            {bugs.map(bug => (
                <li key={bug._id}>
                    <BugPreview bug={bug} />
                    <section className="actions">
                        <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                        {isCreator(bug) && <button className="btn" onClick={() => onRemoveBug(bug._id)}>
                            Delete
                        </button>}
                    </section>
                </li>
            ))}
        </ul >
    )
}
