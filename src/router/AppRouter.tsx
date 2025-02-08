import React from "react";
import { Route, Routes } from "react-router-dom"
import { Landing } from "../pages/Landing";
import { AuthRouter } from "./Auth/AuthRouter";

export const AppRouter = () => {
    return (
        <>
            <Routes>

                <Route path="/" element={<Landing />} />
                <Route path="/auth/*" element={<AuthRouter />} />

            </Routes>
        </>
    )
}
