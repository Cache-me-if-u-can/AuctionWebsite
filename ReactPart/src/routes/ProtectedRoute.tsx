import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

//*TODO: Added `allowedUserTypes` prop to restrict access to certain user types to the managed listings page 
interface ProtectedRouteProps {
  children: JSX.Element;
  needToBeLoggedIn: boolean;
  redirectPath: string;
  allowedUserTypes?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  needToBeLoggedIn,
  redirectPath,
  allowedUserTypes,
}) => {
  const { isLoggedIn, getUserType } = useUser(); //TODO: { loading } - true if request is fetching

  // TODO: use { loading } to show a placeholder while request is fetching
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  const userType = getUserType();

  if (isLoggedIn !== needToBeLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedUserTypes && (!userType || !allowedUserTypes.includes(userType))) {
    return <Navigate to="/searchAuctions" replace />;
  }

  return children;
};

export default ProtectedRoute;