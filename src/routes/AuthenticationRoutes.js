import { lazy } from "react";

// project imports
import Loadable from "ui-component/Loadable";
import MinimalLayout from "layout/MinimalLayout";
import { Navigate } from "react-router";

// login option 3 routing
const AuthLogin3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Login3"))
);
const AuthRegister3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Register3"))
);
const PageNotFound = Loadable(lazy(() => import("views/pages/PageNotFound")));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  // element: <AuthLogin3 />,
  children: [
    {
      path: "/",
      element: <Navigate to="/login" replace />,
      exact:true,
      // element: <AuthLogin3 />,
    },
    {
      path: "/login",
      element: <AuthLogin3 />,
    },
    // {
    //   path: '/register',
    //   element: <AuthRegister3 />
    // },
    {
      path: "/*",
      element: <PageNotFound />,
    },
  ],
};

export default AuthenticationRoutes;
