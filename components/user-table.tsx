"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteUser } from "@/actions/user-actions"
import type { User } from "@/types/user"

interface UserTableProps {
  users: User[]
}

export function UserTable({ users: initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      await deleteUser(userToDelete.id)
      setUsers(users.filter((user) => user.id !== userToDelete.id))
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
    } finally {
      setIsDeleting(false)
      setUserToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setUserToDelete(null)
  }

  const getProviderLabel = (provider: string) => {
    const labels: Record<string, string> = {
      email: "Email",
      google: "Google",
      apple: "Apple",
      facebook: "Facebook",
    }
    return labels[provider] || provider
  }

  const getProviderClass = (provider: string) => {
    const classes: Record<string, string> = {
      email: "bg-gray-100",
      google: "bg-red-100 text-red-800",
      apple: "bg-gray-800 text-white",
      facebook: "bg-blue-100 text-blue-800",
    }
    return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[provider] || "bg-gray-100"}`
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={getProviderClass(user.provider)}>{getProviderLabel(user.provider)}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(user)}
                      aria-label={`Excluir ${user.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário {userToDelete?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
