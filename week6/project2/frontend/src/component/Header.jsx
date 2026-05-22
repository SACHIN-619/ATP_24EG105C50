
import {NavLink} from 'react-router'

function Header() {
  return (
    <div>
        <nav className="flex justify-end text-3xl p-7 bg-gray-400">
            <NavLink to="/" className={({isActive})=>(isActive) ? "bg-amber-400"}>Home</NavLink>
        </nav>
        <nav>
            <NavLink to="/">CreateEmps</NavLink>
        </nav>
        <nav>
            <NavLink to="">Employees</NavLink>
        </nav>
    </div>
  )
}

export default Header