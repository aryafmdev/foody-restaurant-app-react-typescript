import axios from 'axios'
import { API_BASE_URL } from '../../config/env'

let tokenProvider: (() => string | null) | null = null

export const setTokenProvider = (fn: () => string | null) => {
  tokenProvider = fn
}

export const http = axios.create({
  baseURL: API_BASE_URL,
})

http.interceptors.request.use((config) => {
  const token = tokenProvider ? tokenProvider() : null
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
