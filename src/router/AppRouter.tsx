import React from "react";
import { Route, Routes } from "react-router-dom"
import { Landing } from "../pages/Landing";

export const AppRouter = () => {
    return (
        <>
            <Routes>
{/* 
                <Route path='/inicio' element={
                        <FileUpload />
                } /> */}

                <Route path="/" element={
                        <Landing />
                } />

            </Routes>
        </>
    )
}
