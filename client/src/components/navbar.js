import React, { useContext } from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }
    return(
        <nav>
        <div className="nav-wrapper teal darken-4" style={{padding: '0 2rem'}}>
          <ul className="left">
            <li><NavLink to="/create">Create Links</NavLink></li>
            <li><NavLink to="/links">Links</NavLink></li>
            <li><NavLink to="/posts">Posts</NavLink></li>
            <li><a className="brand-logo right" href="/" onClick={logoutHandler}>Logout</a></li>
          </ul>
        </div>
      </nav>
    )
}