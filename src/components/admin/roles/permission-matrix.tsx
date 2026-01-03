'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Permission } from '@/types/permission';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface PermissionMatrixProps {
    permissions: Permission[];
    selectedIds: number[];
    onChange: (ids: number[]) => void;
}

export default function PermissionMatrix({ permissions, selectedIds, onChange }: PermissionMatrixProps) {
    const t = useTranslations('PermissionMatrix');
    const [searchQuery, setSearchQuery] = useState('');

    // Group permissions by resource
    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        permissions.forEach((p) => {
            if (!groups[p.resource]) {
                groups[p.resource] = [];
            }
            groups[p.resource].push(p);
        });
        return groups;
    }, [permissions]);

    // Filter groups based on search
    const filteredGroups = useMemo(() => {
        if (!searchQuery) return groupedPermissions;

        const filtered: Record<string, Permission[]> = {};
        Object.entries(groupedPermissions).forEach(([resource, perms]) => {
            const matchesResource = resource.toLowerCase().includes(searchQuery.toLowerCase());
            const matchingPerms = perms.filter(p =>
                p.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchesResource || matchingPerms.length > 0) {
                filtered[resource] = matchesResource ? perms : matchingPerms;
            }
        });
        return filtered;
    }, [groupedPermissions, searchQuery]);

    const handleTogglePermission = (id: number, checked: boolean) => {
        if (checked) {
            onChange([...selectedIds, id]);
        } else {
            onChange(selectedIds.filter((pid) => pid !== id));
        }
    };

    const handleToggleResource = (resource: string, checked: boolean) => {
        const resourcePerms = groupedPermissions[resource];
        const resourcePermIds = resourcePerms.map((p) => p.id);

        if (checked) {
            // Add all IDs from this resource that aren't already selected
            const newIds = [...selectedIds];
            resourcePermIds.forEach((id) => {
                if (!newIds.includes(id)) {
                    newIds.push(id);
                }
            });
            onChange(newIds);
        } else {
            // Remove all IDs from this resource
            onChange(selectedIds.filter((id) => !resourcePermIds.includes(id)));
        }
    };

    const isResourceFullySelected = (resource: string) => {
        const resourcePerms = groupedPermissions[resource];
        return resourcePerms.every((p) => selectedIds.includes(p.id));
    };

    const isResourcePartiallySelected = (resource: string) => {
        const resourcePerms = groupedPermissions[resource];
        const selectedCount = resourcePerms.filter((p) => selectedIds.includes(p.id)).length;
        return selectedCount > 0 && selectedCount < resourcePerms.length;
    };

    const defaultOpenItems = useMemo(() => {
        return Object.entries(groupedPermissions)
            .filter(([_, perms]) => perms.some((p) => selectedIds.includes(p.id)))
            .map(([resource]) => resource);
    }, [groupedPermissions]); // Only calculate based on initial groups, selectedIds is used from closure but we want this stable on mount

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder={t('searchPermissions')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9"
                />
            </div>

            {/* Matrix */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <Accordion type="multiple" className="w-full" defaultValue={defaultOpenItems}>
                    {Object.entries(filteredGroups).map(([resource, perms]) => (
                        <AccordionItem key={resource} value={resource} className="border-b last:border-0">
                            <div className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <Checkbox
                                    checked={isResourceFullySelected(resource) || (isResourcePartiallySelected(resource) ? 'indeterminate' : false)}
                                    onCheckedChange={(checked) => handleToggleResource(resource, checked as boolean)}
                                    className="mr-3"
                                />
                                <AccordionTrigger className="flex-1 py-2 hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm capitalize">{resource}</span>
                                        <Badge variant="secondary" className="text-xs font-normal h-5 px-1.5">
                                            {perms.length}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                            </div>
                            <AccordionContent className="px-4 pb-3 pt-0 bg-slate-50/50 dark:bg-slate-900/20">
                                <div className="grid gap-3 pl-9 pt-2">
                                    {perms.map((permission) => (
                                        <div key={permission.id} className="flex items-center justify-between group">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {permission.action}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {permission.description}
                                                </span>
                                            </div>
                                            <Switch
                                                checked={selectedIds.includes(permission.id)}
                                                onCheckedChange={(checked) => handleTogglePermission(permission.id, checked)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
