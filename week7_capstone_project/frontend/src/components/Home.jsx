import { NavLink } from "react-router";
import { pageBackground, submitBtn } from "../Styles/common";

function Home() {
  return (
    <div className={`${pageBackground} flex flex-col items-center justify-center py-20 px-4 text-center`}>
      <h1 className="text-5xl font-bold text-[#1d1d1f] mb-6 tracking-tight">
        Share Your Stories with the World
      </h1>
      <p className="text-xl text-[#86868b] max-w-2xl mb-10">
        A premium platform for writers and readers. Explore insightful articles or start your own journey as an author.
      </p>
      
      <div className="flex gap-4">
        <NavLink to="/register" className={submitBtn}>
          Get Started
        </NavLink>
        <NavLink to="/login" className="px-8 py-3 rounded-full border border-[#d2d2d7] text-[#0066cc] font-medium hover:bg-gray-50 transition">
          Sign In
        </NavLink>
      </div>

      <div className="mt-20 w-full max-w-5xl">
        <img 
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000" 
          alt="Blogging" 
          className="rounded-3xl shadow-2xl mx-auto object-cover  w-full"
        />
      </div>
    </div>
  );
}

export default Home;