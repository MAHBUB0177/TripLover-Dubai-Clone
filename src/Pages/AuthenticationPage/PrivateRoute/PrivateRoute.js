import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const PrivateRoute = ({ children, ...rest }) => {
  const { login } = useAuth();
  const location = useLocation();
  // if (localStorage.getItem("appVersion") !== "2.0.0") {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("popup");
  //   localStorage.removeItem("userRole");
  //   localStorage.removeItem("notificationCount");
  //   window.location.href = "/";
  // }
  if (login === true) {
    return children;
  }
  return <Navigate to="/" state={{ from: location }} />;
};

export default PrivateRoute;
