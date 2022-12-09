export const axiosOptions = {
  baseURL: typeof window === 'object' ? '/api' : 'http://127.0.0.1:3000/api',
  timeout: 10000,
  withCredentials: true
}
