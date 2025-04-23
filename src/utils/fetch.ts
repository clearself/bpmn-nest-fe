export default function fetchRequest(url: string, options: any) {
  const baseURL = import.meta.env.VITE_APP_CHAT_API
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_APP_CHAT_KEY}`
  }
  options.headers = {
    ...headers,
    ...options.headers
  }
  return fetch(baseURL + url, options)
}
