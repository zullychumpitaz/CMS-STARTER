import { Option } from "@/components/ui/multiselect"

export function mapPermissionsToOptions(permissions: { id: string; name: string }[]): Option[] {
  return permissions.map(p => ({
    value: p.id,   // el id será el value
    label: p.name, // el nombre será el label
  }))
}