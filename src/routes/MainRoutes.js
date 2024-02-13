import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import Cookies from "js-cookie";
import { Navigate } from "react-router";
// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);

const ClusteredMatches = Loadable(
  lazy(() => import("views/pages/ClusteredMatches/ClusteredMatches"))
);

const ApprovedMatches = Loadable(
  lazy(() => import("views/pages/ApprovedMatches/ApprovedMatches"))
);
const AuthLogin3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Login3"))
);

// ==============================|| MAIN ROUTING ||============================== //

const ProtectedRoute = ({ element }) => {
  // const isAuthenticated = Cookies.get("userToken") !== undefined;
  const isAuthenticated = Boolean(Cookies.get("userToken"));
  return isAuthenticated ? (
    element
  ) : (
    // Redirect to the login page if the user is not authenticated
    <Navigate to="/login" replace />
  );
};

const MainRoutes = {
  path: "/",
  element: <ProtectedRoute element={<MainLayout />} />,
  children: [
    {
      path: "/",
      element: <ClusteredMatches />,
    },
    {
      path: "dashboard",
      element: <DashboardDefault />,
    },

    {
      path: "/clustered-matches",
      element: <ClusteredMatches />,
    },
    {
      path: "/approved-matches",
      element: <ApprovedMatches />,
    },
  ],
};

export default MainRoutes;
