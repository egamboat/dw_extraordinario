import React from "react";
import { Route, Routes } from "react-router-dom"
import { Login } from "../../pages/Auth/Login";
import { Register } from "../../pages/Auth/Register";
import { NewPassword } from "../../pages/Auth/RecoverPass";

export const AuthRouter = () => {
    return (
        <>
            <Routes>

                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="reset-password/:token" element={<NewPassword />} />

            </Routes>
        </>
    )
}
