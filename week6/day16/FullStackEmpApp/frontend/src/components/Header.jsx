import { NavLink } from "react-router";
import { useContext } from "react";
import { CounterContext } from "../store/CounterContext";

function Header() {
  const { counter } = useContext(CounterContext);

  return (
    <nav className="flex justify-between items-center p-6 bg-slate-800 text-white shadow-md">
      <div className="text-2xl font-bold">EmpApp</div>
      <div className="flex gap-6 items-center">
        <NavLink to="" className={({ isActive }) => (isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-200 transition-colors")}>
          Home
        </NavLink>
        <NavLink to="create-emp" className={({ isActive }) => (isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-200 transition-colors")}>
          CreateEmp
        </NavLink>
        <NavLink to="list" className={({ isActive }) => (isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-200 transition-colors")}>
          List of Employees
        </NavLink>
        <div className="bg-white text-slate-800 px-3 py-1 rounded-full text-sm font-bold shadow-inner">
          Count: {counter}
        </div>
      </div>
    </nav>
  );
}

export default Header;