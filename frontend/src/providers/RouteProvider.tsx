import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../component/Home";
import App from "../App";
import LoginPage from "../component/LoginPage";
import SignUp from "../component/SignUp";
import Auth from "../Authpage/Auth";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
const Router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
function RouteProvider() {
  return <RouterProvider router={Router} />;
}

export default RouteProvider;
