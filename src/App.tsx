import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./components/layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivateRoute from "./privateRoute"
import Conversion from "./pages/Conversion"
import Favorites from "./pages/Favorite"


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/conversion-history",
            element: <Conversion />
          },
          {
            path: "/favorites",
            element: <Favorites />
          }
        ]
      }
    ]
  }
])

export { router }