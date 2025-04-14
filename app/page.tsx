import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import LoginForm from "@/components/login-form"

export default async function Home() {
  // Verificar se o usuário já está autenticado
  const isAuthenticated = (await cookies()).has("admin_session")

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-500 mt-2">Faça login para gerenciar seu aplicativo</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
