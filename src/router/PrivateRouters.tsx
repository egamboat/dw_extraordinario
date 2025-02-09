import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    return token && username ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
