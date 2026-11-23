'use client'

import { useEffect } from 'react'

import axiosInstance from 'src/lib/axios'

export default function CsrfToken({ children }) {
  useEffect(() => {
    axiosInstance.get('/sanctum/csrf-cookie')
      .catch(err => console.error('Failed to get CSRF cookie:', err))
  }, [])
  
  return <>{children}</>
}