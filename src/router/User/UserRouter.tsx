import React from "react";
import { Route, Routes } from "react-router-dom"
import { Benchmarks } from "../../pages/User/Benchmarks";
import { Home } from "../../pages/User/Home";
import UserLayout from "../../componets/User/UserLayout";

export const UserRouter = () => {
    return (
        <>
            <UserLayout>
                <Routes>

                    <Route path="/" element={<Home />} />
                    <Route path="results" element={<Benchmarks />} />

                </Routes>
            </UserLayout >
        </>

    )
}
