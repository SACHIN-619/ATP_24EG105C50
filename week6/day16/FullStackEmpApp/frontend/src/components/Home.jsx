import React from 'react'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-5xl font-bold text-slate-800 mb-4">
        Welcome to Employee Management App
      </h1>
      <p className="text-xl text-slate-600">
        Easily manage and track your organization's members.
      </p>
    </div>
  );
}

export default Home;