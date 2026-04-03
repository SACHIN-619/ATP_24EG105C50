import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import CreateEmp from "./components/CreateEmp";
import Employee from "./components/Employee.jsx"
import ListOfEmps from "./components/ListOfEmps";
import EditEmployee from "./components/EditEmployee.jsx"

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "create-emp", element: <CreateEmp /> },
        { path: "list", element: <ListOfEmps /> },
        {path: "employee", element:<Employee />},
        {path:"edit-emp",element:<EditEmployee/>}
      ],
    },
  ]);

  return <RouterProvider router={routerObj} />;
}

export default App;
