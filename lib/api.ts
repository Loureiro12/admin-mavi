import { getAccessToken } from "@/actions/auth-actions"


export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAccessToken()
  
  if (!token) {
    throw new Error("Não autenticado")
  }

  const headers = new Headers(options.headers)
  headers.set("Authorization", `Bearer ${token}`)

  return fetch(url, {
    ...options,
    headers,
  })
}