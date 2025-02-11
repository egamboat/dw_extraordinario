import React from "react";
import { Route, Routes } from "react-router-dom"
import UserLayout from "../../componets/User/UserLayout";
import { Account, Benchmarks, HomeDashboard } from "../../pages/User";
import { UserProvider } from "../../services/User/context/UserContext";

export const UserRouter = () => {
    return (
        <>
            <UserProvider>
                <UserLayout>
                    <Routes>

                        <Route path="/" element={<HomeDashboard />} />
                        <Route path="results" element={<Benchmarks />} />
                        <Route path="account" element={<Account />} />

                    </Routes>
                </UserLayout >
            </UserProvider>
        </>

    )
}
