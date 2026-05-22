// import Root from 'postcss/lib/root'
import {createBrowserRouter,RouterProvider,Navigate} from 'react-router'
import RootLayout from './component/RootLayout'
import Home from './component/Home'
import Register from './component/Register'
import Login from './component/Login'
import Technologies from './component/Technologies.jsx'
import Java from './component/Java.jsx'
import Node from './component/Node.jsx'
import Vue from './component/Vue.jsx'

function App(){
  //adding routing ocnig
  const routerObj = createBrowserRouter([
    {
      path:"/",
      element:<RootLayout />,
      children:[
        {
          path:'',
          element:<Home/>
        },
        {
          path:'register',
          element:<Register />
        },
        {
          path: "login",
          element:<Login/>
        },
        {
          path: "technologies",
          element:<Technologies />,
          children:[
            {
              index:true,  //to deal with whitepage issue immediatley load java
              element:<Navigate to="java"/>  //for highligthing nav bar

            },
            {
              path:"java",
              element:<Java/>

          },{
            path:"node",
            element:<Node />
          },
          {
            path:"vue",
            element:<Vue />
          }

        ]
          
        }
      ]
    }
  ])


  return(
    <RouterProvider router = {routerObj}/>

  )
}

export default App