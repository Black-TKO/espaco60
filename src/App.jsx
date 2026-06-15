import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import { ToastProvider } from './context/ToastContext'
import { Toast } from './components/common/Toast'
import { BookingPage } from './pages/BookingPage/BookingPage'
import { AdminLogin } from './pages/AdminPage/AdminLogin'
import { AdminDashboard } from './pages/AdminPage/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toast />
        </ToastProvider>
      </BookingProvider>
    </BrowserRouter>
  )
}
