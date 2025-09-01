"use client";

import { BreadCrumbHeader } from "@/components/shared/BreadCrumbHeader";
import { Button } from "@/components/ui/button";
import { getLogs, getDistinctLogEntities, getDistinctLogPerformers } from "@/modules/logs/logs-actions";
import LogsTable from "@/modules/logs/LogsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { JsonValue } from "@prisma/client/runtime/library";
import { ScrollText } from "lucide-react";

export type Log = {
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    details: JsonValue;
    performedBy: string;
    createdAt: Date;
    user: {
        name: string | null;
        email: string | null;
    } | null;
    entityName: string | null;
};

const items = [
    { label: "Dashboard", href: "/" },
    { label: "Logs", href: "/logs" },
    { label: "Listado de logs" }
];

export default function LogsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const defaultPage = 1;
    const defaultPageSize = 10;

    const page = parseInt(searchParams.get('page') || String(defaultPage));
    const pageSize = parseInt(searchParams.get('pageSize') || String(defaultPageSize));
    const entityFilter = searchParams.get('entity') || 'all'; // Default to 'all'
    const performedByFilter = searchParams.get('performedBy') || 'all'; // Default to 'all'

    const [currentLogs, setCurrentLogs] = useState<Log[]>([]);
    const [totalLogsCount, setTotalLogsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [entities, setEntities] = useState<string[]>([]);
    const [performers, setPerformers] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const currentParams = new URLSearchParams(searchParams.toString());
        if (!currentParams.has('page')) {
            currentParams.set('page', String(defaultPage));
        }
        if (!currentParams.has('pageSize')) {
            currentParams.set('pageSize', String(defaultPageSize));
        }
        if (currentParams.toString() !== searchParams.toString()) {
            router.replace(`/logs?${currentParams.toString()}`);
        }
    }, [searchParams, router, defaultPage, defaultPageSize]);

    useEffect(() => {
        const fetchPageData = async () => {
            setIsLoading(true);
            const actualEntityFilter = entityFilter === 'all' ? undefined : entityFilter;
            const actualPerformedByFilter = performedByFilter === 'all' ? undefined : performedByFilter;
            const { logs, totalCount } = await getLogs(page, pageSize, actualEntityFilter, actualPerformedByFilter);
            setCurrentLogs(logs);
            setTotalLogsCount(totalCount);
            setIsLoading(false);
        };
        fetchPageData();
    }, [page, pageSize, entityFilter, performedByFilter, searchParams]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            const distinctEntities = await getDistinctLogEntities();
            setEntities(distinctEntities);
            const distinctPerformers = await getDistinctLogPerformers();
            setPerformers(distinctPerformers);
        };
        fetchFilterOptions();
    }, []);

    const totalPages = Math.ceil(totalLogsCount / pageSize);

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'all') {
            params.delete(name);
        } else {
            params.set(name, value);
        }
        return params.toString();
    };

    const handlePreviousPage = () => {
        const newPage = Math.max(page - 1, 1);
        router.push(`/logs?${createQueryString('page', String(newPage))}`);
    };

    const handleNextPage = () => {
        const newPage = Math.min(page + 1, totalPages);
        router.push(`/logs?${createQueryString('page', String(newPage))}`);
    };

    const handleItemsPerPageChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('pageSize', value);
        params.set('page', '1'); // Reset page to 1
        router.push(`/logs?${params.toString()}`);
    };

    const handleEntityFilterChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'all') {
            params.delete('entity');
        } else {
            params.set('entity', value);
        }
        params.set('page', '1'); // Reset page to 1
        router.push(`/logs?${params.toString()}`);
    };

    const handlePerformedByFilterChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'all') {
            params.delete('performedBy');
        } else {
            params.set('performedBy', value);
        }
        params.set('page', '1'); // Reset page to 1
        router.push(`/logs?${params.toString()}`);
    };

    return (
        <>
            <section className="flex flex-col gap-4 px-2">
                <BreadCrumbHeader items={ items } />
                <section className="flex justify-between ">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Logs</h1>
                        <p className="text-muted-foreground text-sm">Visualiza los registros de actividad del sistema.</p>
                    </div>
                </section>
                
                {/* Filter Section */}
                <Card>
                    <CardContent className="px-6">
                        <section className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium">Entidad:</p>
                                <Select value={entityFilter} onValueChange={handleEntityFilterChange}>
                                    <SelectTrigger className="h-8 w-[150px]">
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        {entities.map((entity) => (
                                            <SelectItem key={entity} value={entity}>
                                                {entity}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium">Realizado por:</p>
                                <Select value={performedByFilter} onValueChange={handlePerformedByFilterChange}>
                                    <SelectTrigger className="h-8 w-[150px]">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        {performers.map((performer) => (
                                            <SelectItem key={performer.id} value={performer.id}>
                                                {performer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </section>
                    </CardContent>
                </Card>

                <section className="">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ScrollText className="w-5 h-5 text-emerald-500" />
                                Listado de Logs</CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <LogsTable logs={currentLogs} />
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-10">
                                    <p>Cargando logs...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <div className="flex items-center justify-between space-x-2 p-4">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Items por página</p>
                            <Select value={String(pageSize)} onValueChange={handleItemsPerPageChange}>
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 50].map((size) => (
                                        <SelectItem key={size} value={String(size)}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                            Página {page} de {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={page === 1 || isLoading}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={page === totalPages || isLoading}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}
