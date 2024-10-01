import { Navigate, useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { WebSocketCall } from 'api/WebSocket';
// import { Navigate } from "react-router";

// ==============================|| ROUTING RENDER ||============================== //

// export default function ThemeRoutes() {
//   return useRoutes([MainRoutes,AuthenticationRoutes]);
// }

export default function ThemeRoutes() {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const data = {
    name: activeAccount?.name,
    email: activeAccount?.username,
    // role: 
  }
  localStorage.setItem("Profile_Details", JSON.stringify(data));

  WebSocketCall()
  return useRoutes([MainRoutes]);
}

// export default function ThemeRoutes() {
//   const isAuthenticated = useIsAuthenticated()
//   const routes = isAuthenticated ? MainRoutes : AuthenticationRoutes;
//   console.log(isAuthenticated, "auth ", routes, " routesfile" )

//   return useRoutes([
//     // Render the appro priate routes
//     routes,
//     // Redirect to login if the user tries to access a protected route without authentication
//     // !isAuthenticated && <Navigate to="/login" replace />,
//   ]);
// }