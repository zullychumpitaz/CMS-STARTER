import { useId } from "react"
import MultipleSelector, { Option } from "@/components/ui/multiselect"

type Props = {
  options: Option[]             // todas las opciones disponibles
  value: string[]               // ids seleccionados en el form
  onChange: (value: string[]) => void
}

export default function SelectPermissions({ options, value, onChange }: Props) {
  const id = useId()
  // convertir los string[] en Option[] para el selector
  const selectedOptions = options.filter(opt => value.includes(opt.value))

  return (
    <div className="*:not-first:mt-2">
      <MultipleSelector
        commandProps={{ label: "Selecciona los permisos" }}
        value={options.filter(opt => value.includes(opt.value))} // Directly filter here
        onChange={(opts) => onChange(opts.map(o => o.value))} // Keep this as it's correct
        defaultOptions={options}
        placeholder="Seleciona los permisos"
        hideClearAllButton
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-sm">No hay coincidencias</p>}
      />
    </div>
  )
}
