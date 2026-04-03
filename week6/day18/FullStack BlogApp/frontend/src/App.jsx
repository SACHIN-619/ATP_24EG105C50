import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import AuthorProfile from "./components/AuthorProfile";
import AuthorArticles from "./components/AuthorArticles";
import EditArticle from "./components/EditArticles";
import WriteArticles from "./components/WriteArticles";
import ArticleByID from "./components/ArticleById";
import {Toaster} from 'react-hot-toast'
function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "author-profile",
          element: <AuthorProfile />,

          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticles />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path: "edit-article",
          element: <EditArticle />,
        },
      ],
    },
  ]);

  return(
  <div>
    <Toaster postion="top-center" reverseOrder:false/>
    <RouterProvider router={routerObj} />;

  </div>
)
}

export default App;

// import {createBrowserRouter,RouterProvider} from 'react-router'
// import RootLayout from './component/RootLayout.jsx'
// import Home from './component/Home.jsx'
// import Register from './component/Register.jsx'
// import Login from './component/Login.jsx'
// import UserProfile from './component/UserProfile.jsx'
// import AdminProfile from './component/AdminProfile.jsx'
// import AuthorArticles from './component/AuthorArticles.jsx'


// function App() {

//   const routerObj = createBrowserRouter([

//     {
//       path:'/',
//       element:<RootLayout />,
//       children: [{
//         path:'Home',
//         element:<Home />

//       },{
//         path:'Login',
//         element:<Login />
//       },{
//         path:'register',
//         element:<Register />
//       },{
//         path:'user-Profile',
//         element:<UserProfile />
//       },{
//         path:'admin-Profile',
//         element:<AdminProfile />
//       },{
//         path:'author-Profile',
//         element:<AuthorArticles />
//       }
//   ],}
//   ])

//   return (<RouterProvider router ={routerObj}/>
//   )
// }

// export default App