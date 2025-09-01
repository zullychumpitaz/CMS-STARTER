'use client';

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Filter, KeyRound, Search, XCircle } from 'lucide-react';
import { PermissionWithRoles } from './permissions-utils';
import { Badge } from '@/components/ui/badge';
import { getPermissionColor } from '@/types/roles';
import { PermissionActionsMenu } from './PermissionActionsMenu';

const PermissionsTable = ({ permissionsDB }: { permissionsDB: PermissionWithRoles[]}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');


  // Filtrar permisos
  const filteredPermissions = useMemo(() => {
    return permissionsDB.filter(permission => {
      const matchesSearch = !searchQuery || 
        permission.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || permission.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && !permission.deletedAt && permission.isActive) || 
            (statusFilter === 'inactive' && !permission.deletedAt && !permission.isActive) || 
            (statusFilter === 'deleted' && permission.deletedAt);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [permissionsDB, searchQuery, categoryFilter, statusFilter]);

    return (
        <div className='flex flex-col gap-4 w-full'>
        {/* Filtros */}
        <Card>
            <CardContent className="px-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                    placeholder="Buscar permisos..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                
                <div className="flex items-center gap-4">
                <Filter className="w-4 h-4 text-slate-500" />

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                    <SelectItem value="deleted">Eliminados</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            </CardContent>
        </Card>

        {/* Tabla de Permisos */}
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-500" />
                Permisos del Sistema ({filteredPermissions.length})
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="rounded-lg border">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className="bg-background">
                        <TableHead className="w-4/12">Permiso</TableHead>
                        <TableHead className="w-2/12">Categoría</TableHead>
                        <TableHead className="w-2/12">Estado</TableHead>
                        <TableHead className="w-4/12">Roles Asignados</TableHead>
                        <TableHead className="w-1/12">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                        Array(8).fill(0).map((_, i) => (
                            <TableRow key={i}>
                            <TableCell colSpan={4} className="text-center py-4">
                                <div className="animate-pulse h-4 bg-slate-200 rounded"></div>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : filteredPermissions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                            No se encontraron permisos con los filtros actuales
                            </TableCell>
                        </TableRow>
                        ) : (
                        filteredPermissions.map((permission) => {
                            const action = permission.name.split(":")[1];
                            const color = getPermissionColor(action);
                            return (
                            <TableRow key={permission.id} className="hover:bg-muted">
                                <TableCell>
                                <div className='flex-1'>
                                    <p className="font-medium text-foreground">{permission.description}</p>
                                    <p className="text-sm text-slate-500 mt-1">{permission.name}</p>
                                </div>
                                </TableCell>
                                
                                <TableCell>
                                <Badge variant="outline" className={`${color }`}>
                                    {permission.category}
                                </Badge>
                                </TableCell>
                                
                                <TableCell>
                                <div className="flex items-center gap-2">
                                    {permission.deletedAt ? (
                                        <>
                                            <XCircle className="w-4 h-4 text-red-500" />
                                            <span className="text-sm font-medium text-red-600">Eliminado</span>
                                        </>
                                    ) : permission.isActive ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            <span className="text-sm font-medium text-emerald-600">Activo</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm font-medium text-orange-600">Inactivo</span>
                                        </>
                                    )}
                                </div>
                                </TableCell>
                                
                                <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {permission.roles.length > 0 ? (
                                    permission.roles.map(role => (
                                        <Badge 
                                        key={role.role.id} 
                                        variant="secondary"
                                        className="text-xs"
                                        >
                                        {role.role.name}
                                        </Badge>
                                    ))
                                    ) : (
                                    <span className="text-sm text-slate-400 italic">
                                        Sin roles asignados
                                    </span>
                                    )}
                                </div>
                                </TableCell>
                                <TableCell>
                                  <PermissionActionsMenu permission={permission} />
                                </TableCell>
                            </TableRow>
                            );
                        })
                        )}
                    </TableBody>
                </Table>
            </div>
            </CardContent>
        </Card>
        </div>
    )
}

export default PermissionsTable
