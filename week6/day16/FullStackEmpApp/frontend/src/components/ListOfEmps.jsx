import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { CounterContext } from "../store/CounterContext";

function ListOfEmps() {
  const [emps, setEmps] = useState([]);
  const navigate = useNavigate();
  const { setCounterValue, decrement } = useContext(CounterContext);

  const gotoEmpoyee = (empObj) => {
    //navigate to /employee along with selected emp obj
    navigate("/employee", { state: empObj });
  };

  const gotoEditEmpoyee = (empObj) => {
    //navigate to /employee along with selected emp obj
    navigate("/edit-emp",{state:empObj});
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        console.log("--- Deletion UI Triggered ---");
        console.log("ID to delete:", id);
        
        const deleteUrl = `/emp-api/employees/${id}`;
        console.log("Calling URL:", deleteUrl);

        let res = await fetch(deleteUrl, {
          method: "DELETE",
        });
        
        console.log("Response Status:", res.status);
        const rawText = await res.text();
        console.log("Raw Response Body:", rawText);

        if (res.status === 200) {
          const resData = JSON.parse(rawText);
          console.log("Parsed Success Data:", resData);
          
          // Remove from local state
          setEmps(prevEmps => prevEmps.filter(emp => emp._id !== id));
          // Sync global counter
          decrement();
          alert("Employee deleted successfully!");
        } else {
          let errorInfo = rawText;
          try {
            const parsedError = JSON.parse(rawText);
            errorInfo = parsedError.message || parsedError.reason || rawText;
          } catch (e) {
            // Not JSON
          }
          console.error("Deletion failed with status:", res.status, "Error:", errorInfo);
          alert(`Server Error (${res.status}): ${errorInfo}\nURL: ${deleteUrl}`);
        }
      } catch (err) {
        console.error("Network/Runtime error during deletion:", err);
        alert(`Network Error: ${err.message}\nMake sure the backend is running at http://localhost:4000`);
      }
    }
  };

  useEffect(() => {
    async function getEmps() {
      try {
        let res = await fetch("/emp-api/employees");
        if (res.status === 200) {
          let resObj = await res.json();
          setEmps(resObj.payload);
          setCounterValue(resObj.payload.length);
        }
      } catch (err) {
        console.error("Error fetching employees:", err.message);
      }
    }
    getEmps();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center text-slate-800 mb-8">List of Employees</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {emps.map((empObj) => (
          <div key={empObj._id} className="bg-white p-6 border-2 border-slate-200 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-bold mb-2">{empObj.name}</h3>
            <p className="text-slate-600 mb-1">{empObj.email}</p>
            <p className="text-slate-600 mb-4 italic text-sm">{empObj.designation}</p>
            
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button 
                onClick={() => gotoEmpoyee(empObj)} 
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors"
              >
                View
              </button>
              <button 
                onClick={() => gotoEditEmpoyee(empObj)} 
                className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg font-bold text-sm hover:bg-green-100 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteEmployee(empObj._id)} 
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListOfEmps;