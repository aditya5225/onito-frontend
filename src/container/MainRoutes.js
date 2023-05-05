import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage'
import AddDetails from '../pages/AddDetails'

const MainRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-user" element={<AddDetails />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default MainRoutes;