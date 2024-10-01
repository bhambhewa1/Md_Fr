import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import Cookies from "js-cookie";
import { Navigate } from "react-router";
import { WebSocketCall } from "api/WebSocket";

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("views/dashboard")));

const ClusteredMatches = Loadable(
  lazy(() => import("views/pages/ClusteredMatches/ClusteredMatches"))
);

const ExactMatches = Loadable(
  lazy(() => import("views/pages/ExactMatches/ExactMatches"))
);

const ApprovedMatches = Loadable(
  lazy(() => import("views/pages/ApprovedMatches/ApprovedMatches"))
);

const CurrentMapping = Loadable(
  lazy(() => import("views/pages/CurrentMapping/index"))
);

const DataRefresh = Loadable(
  lazy(() => import("views/pages/DataRefresh/index"))
);

const UserAnalyticsPage = Loadable(
  lazy(() => import("views/dashboard/UserAnalyticsPage"))
);

const PageNotFound = Loadable(lazy(() => import("views/pages/PageNotFound")));

// ==============================|| MAIN ROUTING ||============================== //

// const ProtectedRoute = ({ element }) => {
//   // const isAuthenticated = Cookies.get("userToken") !== undefined;
//   const isAuthenticated = Boolean(Cookies.get("userToken"));

//   // useEffect(() => {
//     if(isAuthenticated){
//       WebSocketCall()
//     }
//   // },[])

//   return isAuthenticated ? (
//     element
//   ) : (
//     // Redirect to the login page if the user is not authenticated
//     <Navigate to="/login" replace />
//   );
// };

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  // element: <ProtectedRoute element={<MainLayout />} />,
  children: [
    {
      path: "/",
      element: <DashboardDefault />,
      // element: <Navigate to="/clustered-matches" replace />,
    },
    // {
    //   path: "/dashboard",
    //   element: <DashboardDefault />,
    // },
    {
      path: "dashboard",
      children: [
        {
          path: '',
          element: <DashboardDefault />
        },
        {
          path: 'user_analytics',
          element: <UserAnalyticsPage />
        }
      ]
    },
    {
      path: "/*",
      element: <PageNotFound />,
    }, 
    {
      path: "/clustered-matches",
      element: <ClusteredMatches />,
    },
    {
      path: "/exact-matches",
      element: <ExactMatches />,
    },
    {
      path: "/approved-matches",
      element: <ApprovedMatches />,
    },
    {
      path: "/current-mapping",
      element: <CurrentMapping />,
    },
    {
      path: "/update-data",
      element: <DataRefresh />,
    },
  ],
};

export default MainRoutes;