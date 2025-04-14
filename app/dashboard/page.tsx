import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { UserTable } from "@/components/user-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { getUsers } from "@/actions/user-actions"

export default async function DashboardPage() {
  // Verificar se o usuário está autenticado
  const isAuthenticated = (await cookies()).has("admin_session")

  if (!isAuthenticated) {
    redirect("/")
  }

  // Buscar usuários
  const users = await getUsers()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
        <UserTable users={users} />
      </main>
    </div>
  )
}
