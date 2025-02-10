import React from "react";
import { Route, Routes } from "react-router-dom"
import { Landing, Guide } from "../pages";
import { AuthRouter } from "./Auth/AuthRouter";
import { UserRouter } from "./User/UserRouter";
import PrivateRoute from "./PrivateRouters";
import PublicRoute from "./PublicRoutes";

export const AppRouter = () => {
    return (
        <>
            <Routes>

                <Route path="/" element={<Landing />} />
                <Route path="guide" element={<Guide />} />

                <Route element={<PublicRoute />}>
                    <Route path="/auth/*" element={<AuthRouter />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/user/*" element={<UserRouter />} />
                </Route>
            </Routes>
        </>
    )
}
