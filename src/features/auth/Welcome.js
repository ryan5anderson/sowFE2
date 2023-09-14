import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import { useState } from 'react'

const Welcome = () => {

    const { username, isManager, isAdmin } = useAuth()

    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => {
        setShowMenu(!showMenu)
      }

    useTitle(`SOWs: ${username}`)

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {username}!</h1>

            <div>
                <p><Link to="/dash/sows/view-sows">View Statment of Work</Link></p>
            </div>

            {/*<button className="old-stuff" onClick={toggleMenu}>old stuff</button>*/}
            
            {showMenu && (
                
                <div className="dropdown-menu">

                    <p><Link to="/dash/notes">View Notes</Link></p>

                    <p><Link to="/dash/notes/new">Add New Note</Link></p>

                    {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

                    {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}

                    <p><Link to="/dash/notes/view">Look at your Notes :X</Link></p>
                </div>
            )}

        </section>
    )

    return content
}
export default Welcome