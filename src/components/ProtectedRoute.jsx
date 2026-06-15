import React from 'react'
import { Navigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

export default function ProtectedRoute({ children }) {
  const { authenticated } = useBooking()

  if (!authenticated) {
    return <Navigate to="/admin" replace />
  }

  return children
}
