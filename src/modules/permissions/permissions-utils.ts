import { Option } from "@/components/ui/multiselect"

export function mapPermissionsToOptions(permissions: { id: string; name: string }[]): Option[] {
  return permissions.map(p => ({
    value: p.id,
    label: p.name,
  }))
}

export type PermissionWithRoles = {
  id: string
  name: string
  description: string | null
  category: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  isActive: boolean
  roles: {
    roleId: string   // o como se llame la FK en RolePermission
    permissionId: string
    role: {
      id: string
      name: string
    }
  }[]
}