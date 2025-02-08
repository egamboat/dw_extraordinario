import React from "react";
import { Route, Routes } from "react-router-dom"
import { Landing } from "../pages/Landing";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";

export const AppRouter = () => {
    return (
        <>
            <Routes>
                {/* 
                <Route path='/inicio' element={
                        <FileUpload />
                } /> */}

                <Route path="/" element={<Landing />} />
                <Route path="login/" element={<Login />} />
                <Route path="register/" element={<Register />} />

            </Routes>
        </>
    )
}
