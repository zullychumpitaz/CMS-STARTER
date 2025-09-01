"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { JsonValue } from "@prisma/client/runtime/library";
import { Log } from "@/app/(cms)/logs/page"; // Import Log type from page.tsx

export default function LogsTable({
  logs,
}: {
  logs: Log[];
}) {

  if (!logs || logs.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-10">
        No hay registros de logs para mostrar.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Entidad</TableHead>
            <TableHead>Realizado por</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Entidad</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            return (
              <TableRow key={log.id}>
                <TableCell>{log.entityId || "N/A"}</TableCell>
                <TableCell>{log.user?.name || log.user?.email || "Desconocido"}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell>
                  <div className="text-xs">
                    <p><strong>Entidad:</strong> {log.entityName || log.entity}</p>
                    <p><strong>Razón:</strong>
                      {(() => {
                        let detailsObject = log.details;
                        if (typeof log.details === 'string') {
                          try {
                            detailsObject = JSON.parse(log.details);
                          } catch (e) {
                            detailsObject = null; // Invalid JSON string
                          }
                        }
                        return detailsObject && typeof detailsObject === 'object' && 'reason' in detailsObject
                          ? String(detailsObject.reason)
                          : 'N/A';
                      })()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
