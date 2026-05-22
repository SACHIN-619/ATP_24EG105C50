import React from 'react'
import {createBrowserForm,reactProvider} from 'react-router'
import RootLayout from './component/RootLayout'
import Home from './component/Home.jsx'
import CreateEmp from './component/CreateEmp.jsx'
import ListOfEmps from './component/ListOfEmps.jsx'

function App() {

  const routerObj=createBrowserForm([
   {
     path:"/",
    element:<RootLayout />,
    children:[
      {
        path: "",element:<Home/>,
        path: "create-emp",element: <CreateEmp/>
        path: "ListOfEmps",element: <ListOfEmps/>
        
      }
    ]
   }
  ])
  return (
    <div>App</div>
  )
}

export default App