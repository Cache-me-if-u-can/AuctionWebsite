import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

interface ProtectedRouteProps {
  children: JSX.Element;
  needToBeLoggedIn: boolean;
  redirectPath: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  needToBeLoggedIn,
  redirectPath,
}) => {
  const { isLoggedIn } = useUser(); //TODO: { loading } - true if request is fetching

  // TODO: use { loading } to show a placeholder while request is fetching
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (isLoggedIn !== needToBeLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
