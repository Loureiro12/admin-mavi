"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logoutAdmin } from "@/actions/auth-actions"

export function DashboardHeader() {
  const router = useRouter()

  async function handleLogout() {
    await logoutAdmin()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Painel Administrativo</h2>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  )
}
