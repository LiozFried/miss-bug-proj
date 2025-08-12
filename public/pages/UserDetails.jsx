const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { json } from "express"
import { userService } from "../services/user.service.js"

export function UserDetails() {

    const [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                navigate('/')
            })
    }

    if (!user) return <div>Loading...</div>

    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse hic saepe nihil magnam nostrum consectetur explicabo. Laboriosam unde eaque, animi repellat recusandae natus sed voluptatem porro, facilis obcaecati earum atque.</p>
            <Link to="/">Back Home</Link>
        </section>
    )
}