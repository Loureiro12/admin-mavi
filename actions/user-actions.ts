"use server"

import type { User } from "@/types/user"
import { getAccessToken } from "./auth-actions"

export async function getUsers(): Promise<User[]> {
  try {
    const token = getAccessToken()
    
    if (!token) {
      throw new Error("Não autenticado")
    }

    const response = await fetch('https://api-mavi.onrender.com/list/accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Para evitar cache em requisições SSR
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar usuários: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || "Erro ao processar resposta da API")
    }

    // Mapeia os dados da API para o formato User
    return data.accounts.map((account: any) => ({
      id: account.id,
      name: account.name || "Nome não informado",
      email: account.email || "Email não informado",
      provider: account.ProviderLogin.length > 0 
        ? account.ProviderLogin[0].provider 
        : "email"
    }))

  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    throw error // Você pode querer retornar um array vazio ou tratar de outra forma
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const token = getAccessToken()
    
    if (!token) {
      throw new Error("Não autenticado")
    }

    const response = await fetch(`https://api-mavi.onrender.com/accounts?accountId=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { 
        success: false, 
        message: errorData.message || "Erro ao excluir usuário" 
      }
    }

    return { success: true }

  } catch (error) {
    console.error("Erro ao excluir usuário:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido" 
    }
  }
}