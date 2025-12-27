import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
} from '@/components/ui/pagination';
import { Edit, Trash2, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import { TagsService } from '@/services/tags-service';
import { Tag, TagSortBy } from '@/types/tags';
import { toastService } from '@/services/toasts-service';
import { Tooltip } from '@/components/ui/tooltip';
import { TableSkeleton } from './table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { useTranslations } from 'next-intl';

interface TagsTableProps {
    tags: Tag[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (tag: Tag) => void;
    onDelete: (tag: Tag) => void;
    onStatusChange?: (tag: Tag) => void;
}

export function TagsTable({
    tags,
    loading,
    page,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    onStatusChange,
}: TagsTableProps) {
    const t = useTranslations('TagsTable');
    const limit = 10;

    if (loading) {
        return <TableSkeleton columnCount={7} rowCount={10} />;
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px] text-center">{t('tagId')}</TableHead>
                            <TableHead className="text-center">{t('tagName')}</TableHead>
                            <TableHead className="text-center">{t('slug')}</TableHead>
                            <TableHead className="text-center">{t('postCount')}</TableHead>
                            <TableHead className="text-center">{t('status')}</TableHead>
                            <TableHead className="text-center">{t('createdDate')}</TableHead>
                            <TableHead className="text-center">{t('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tags.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">
                                    {t('noTagsFound')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="font-medium text-center">{tag.id}</TableCell>
                                    <TableCell className="font-medium text-center">{tag.name}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {tag.slug}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-center">{tag.postCount?.toLocaleString() || 0}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={tag.status === 'active' ? 'default' : 'secondary'}
                                            className={
                                                tag.status === 'active'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                                            }
                                        >
                                            {tag.status === 'active' ? t('active') : t('inactive')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {tag.createdAt ? format(new Date(tag.createdAt), 'dd/MM/yyyy') : '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Tooltip content={t('edit')}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    onClick={() => onEdit(tag)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip
                                                content={
                                                    tag.status === 'active' ? t('deactivate') : t('activate')
                                                }
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 ${tag.status === 'active'
                                                        ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                                        : 'text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                        }`}
                                                    onClick={() => onStatusChange?.(tag)}
                                                >
                                                    {tag.status === 'active' ? (
                                                        <Lock className="h-4 w-4" />
                                                    ) : (
                                                        <Unlock className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content={t('delete')}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => onDelete(tag)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <DataTablePagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                entityName={t('entityName')}
            />
        </div>
    );
}
