import { useLocation } from "react-router";

function Employee() {
  //read state received in navigation
  const { state } = useLocation();

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white border-2 border-slate-200 rounded-xl shadow-sm text-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">{state.name}</h1>
      <div className="space-y-4 text-left">
        <div>
          <span className="font-bold text-slate-600 block text-xs uppercase">Email Address</span>
          <p className="text-lg">{state.email}</p>
        </div>
        <div>
          <span className="font-bold text-slate-600 block text-xs uppercase">Mobile Contact</span>
          <p className="text-lg">{state.mobile || 'None'}</p>
        </div>
        <div>
          <span className="font-bold text-slate-600 block text-xs uppercase">Designation</span>
          <p className="text-lg">{state.designation}</p>
        </div>
        <div>
          <span className="font-bold text-slate-600 block text-xs uppercase">Company</span>
          <p className="text-lg">{state.companyName}</p>
        </div>
      </div>
      <button 
        onClick={() => window.history.back()}
        className="mt-8 text-blue-600 font-bold hover:underline"
      >
        Back to List
      </button>
    </div>
  );
}

export default Employee;