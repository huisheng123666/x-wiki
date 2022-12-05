export const axiosOptions = {
  baseURL: process.browser ? '/api' : 'http://127.0.0.1:3000/api',
  timeout: 5000,
  withCredentials: true
}
