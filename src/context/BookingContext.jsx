import React, { createContext, useContext, useState, useEffect } from 'react'
import { CONFIG } from '../config'

const BookingContext = createContext()

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([])
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    loadBookings()
    checkAuth()
  }, [])

  const loadBookings = () => {
    try {
      const data = localStorage.getItem('salonBookings')
      setBookings(data ? JSON.parse(data) : [])
    } catch (error) {
      console.error('Error loading bookings:', error)
      setBookings([])
    }
  }

  const saveBookings = (newBookings) => {
    localStorage.setItem('salonBookings', JSON.stringify(newBookings))
    setBookings(newBookings)
  }

  const addBooking = (booking) => {
    const newBookings = [...bookings, booking]
    saveBookings(newBookings)
  }

  const updateBookingStatus = (id, status) => {
    const newBookings = bookings.map(b => 
      b.id === id ? { ...b, status } : b
    )
    saveBookings(newBookings)
  }

  const deleteBooking = (id) => {
    const newBookings = bookings.filter(b => b.id !== id)
    saveBookings(newBookings)
  }

  const checkAuth = () => {
    if (sessionStorage.getItem('adminAuth') === '1') {
      setAuthenticated(true)
    }
  }

  const login = (password) => {
    if (password === CONFIG.adminPassword) {
      sessionStorage.setItem('adminAuth', '1')
      setAuthenticated(true)
      loadBookings()
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('adminAuth')
    setAuthenticated(false)
  }

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      authenticated,
      login,
      logout,
      loadBookings,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}
