import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    return token && username ? <Navigate to="/user" replace /> : <Outlet />;
};

export default PublicRoute;
