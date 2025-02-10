import React from "react";
import { Route, Routes } from "react-router-dom"
import UserLayout from "../../componets/User/UserLayout";
import { Account, Benchmarks, HomeDashboard } from "../../pages/User";

export const UserRouter = () => {
    return (
        <>
            <UserLayout>
                <Routes>

                    <Route path="/" element={<HomeDashboard />} />
                    <Route path="results" element={<Benchmarks />} />
                    <Route path="account" element={<Account />} />

                </Routes>
            </UserLayout >
        </>

    )
}
