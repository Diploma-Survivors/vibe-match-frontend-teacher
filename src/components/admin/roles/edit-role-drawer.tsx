'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Role } from '@/types/role';
import { Permission } from '@/types/permission';
import { RolesService } from '@/services/roles-service';
import { getAllPermissions } from '@/services/permission-service';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';
import PermissionMatrix from './permission-matrix';
import { toastService } from '@/services/toasts-service';

interface EditRoleDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role;
    onSuccess: () => void;
}

export default function EditRoleDrawer({ open, onOpenChange, role, onSuccess }: EditRoleDrawerProps) {
    const t = useTranslations('EditRoleDrawer');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

    // Form State
    const [name, setName] = useState(role.name);
    const [slug, setSlug] = useState(role.slug);
    const [priority, setPriority] = useState(role.priority);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

    useEffect(() => {
        if (open) {
            // Reset state when opening
            setName(role.name);
            setSlug(role.slug);
            setPriority(role.priority);
            setSelectedPermissionIds(role.permissions.map(p => p.id));

            // Fetch all permissions
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const permissions = await getAllPermissions();
                    setAllPermissions(permissions);
                } catch (error) {
                    console.error('Failed to fetch permissions:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [open, role]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update Role Details
            await RolesService.updateRole(role.id, {
                name,
                slug,
                priority,
            });

            // Update Permissions
            // Calculate added and removed permissions
            const currentIds = role.permissions.map(p => p.id);
            const addedIds = selectedPermissionIds.filter(id => !currentIds.includes(id));
            const removedIds = currentIds.filter(id => !selectedPermissionIds.includes(id));

            if (addedIds.length > 0) {
                await RolesService.assignPermissions(role.id, { permissionIds: addedIds });
            }

            if (removedIds.length > 0) {
                await RolesService.removePermissions(role.id, { permissionIds: removedIds });
            }

            toastService.success(t('successDescription'));
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toastService.error(t('errorDescription'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[66vw] sm:max-w-[66vw] flex flex-col h-full p-0">
                <SheetHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <SheetTitle>{t('title', { name: role.name })}</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Section 1: Role Metadata */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                {t('roleDetails')}
                            </h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('name')}</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={role.isSystemRole}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">{t('slug')}</Label>
                                        <Input
                                            id="slug"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">{t('priority')}</Label>
                                        <Input
                                            id="priority"
                                            type="number"
                                            value={priority}
                                            onChange={(e) => setPriority(parseInt(e.target.value))}
                                            disabled={role.isSystemRole}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Section 2: Permission Matrix */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                    {t('permissions')}
                                </h3>
                                <span className="text-xs text-slate-500">
                                    {selectedPermissionIds.length} {t('selected')}
                                </span>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                </div>
                            ) : (
                                <div className={role.isSystemRole ? "pointer-events-none opacity-70" : ""}>
                                    <PermissionMatrix
                                        permissions={allPermissions}
                                        selectedIds={selectedPermissionIds}
                                        onChange={setSelectedPermissionIds}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <SheetFooter className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <SheetClose asChild>
                        <Button variant="outline" className="mr-2">
                            {t('cancel')}
                        </Button>
                    </SheetClose>
                    {!role.isSystemRole && (
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            {t('saveChanges')}
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
