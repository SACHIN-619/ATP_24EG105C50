import React from 'react'

function Technologies() {
   return (
    <div>
        <nav className="p-5">
   <ul  className="flex justify-end gap-5 text-2xl">
    {/* <li>
        <NavLink to="/">
            Technologies
        </NavLink>
    </li> */}
    <li>
        <NavLink to="/java" className={({ isActive }) => (isActive ? "text-orange-700 bg-orange-200 p-3" : "")}>
          Java
        </NavLink>
    </li>
    <li>
        <NavLink to="/vue" className={({ isActive }) => (isActive ? "text-orange-700 bg-orange-200 p-3" : "")}>
            Vue
        </NavLink>
    </li>
    <li>
        <NavLink to="/node" className={({ isActive }) => (isActive ? "text-orange-700 bg-orange-200 p-3" : "")}>
            Node
        </NavLink>
    </li>
   </ul>
    </nav>
    </div>
  )
}

export default Technologies