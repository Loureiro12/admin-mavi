"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAdmin(email: string, password: string) {
  try {
    // Verifica primeiro se o email é o permitido
    if (email !== "contato@maviapp.com.br") {
      return { success: false, error: "Acesso permitido apenas para contato@maviapp.com.br" }
    }

    // Faz a requisição para o endpoint de autenticação
    const response = await fetch('https://api-mavi.onrender.com/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Email ou senha inválidos" }
    }

    // Extrai o token da resposta
    const data = await response.json()
    const accessToken = data.access_token

    if (!accessToken) {
      return { success: false, error: "Token de acesso não recebido" }
    }

    // Armazena o token em cookies httpOnly e secure
    const cookieStore = cookies()
    ;(await cookieStore).set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });

    // Armazena o access_token em um cookie separado
    (await
      // Armazena o access_token em um cookie separado
      cookieStore).set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 dia (ajuste conforme a validade do token)
      path: "/",
    })

    return { success: true }

  } catch (error) {
    console.error("Erro durante a autenticação:", error)
    return { success: false, error: "Ocorreu um erro durante a autenticação" }
  }
}

export async function logoutAdmin() {
  const cookieStore = cookies()
  ;(await cookieStore).delete("admin_session")
  ;(await cookieStore).delete("access_token")
  redirect("/") // Redireciona para a página de login após logout
}

// Função para obter o token (pode ser usada em outras actions)
export async function getAccessToken() {
  const cookieStore = cookies()
  return (await cookieStore).get("access_token")?.value
}