import React from 'react'
import { Outlet,NavLink } from 'react-router'  //href replace to to page will not reload

function Header() {
  return (
    <div>
        <nav className="p-5">
   <ul  className="flex justify-end gap-5 text-2xl">
    <li>
        <NavLink to="/" className={({ isActive }) => (isActive ? "text-blue-700 bg-blue-200 p-3" : "")}>
            Home
        </NavLink>
    </li>
    <li>
        <NavLink to="/register" className={({ isActive }) => (isActive ? "text-blue-700 bg-blue-200 p-3" : "")}>
          Register
        </NavLink>
    </li>
    <li>
        <NavLink to="/login" className={({ isActive }) => (isActive ? "text-blue-700 bg-blue-200 p-3" : "")}>
            Login
        </NavLink>
    </li>
    <li>
        <NavLink tp="/technologies" className={({ isActive }) => (isActive ? "text-blue-700 bg-blue-200 p-3" : "")}>
            Technologies
        </NavLink>
    </li>
   </ul>
    </nav>
    </div>
  )
}

export default Header