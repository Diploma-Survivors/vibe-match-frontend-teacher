'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RolesService } from '@/services/roles-service';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: z.string().optional(),
    priority: z.coerce.number().min(1, 'Priority must be at least 1'),
});

interface RoleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function RoleFormDialog({ open, onOpenChange, onSuccess }: RoleFormDialogProps) {
    const t = useTranslations('RoleFormDialog');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            priority: 10,
        },
    });

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue('name', name);
        if (!form.formState.dirtyFields.slug) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            form.setValue('slug', slug);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            await RolesService.createRole({
                name: values.name,
                slug: values.slug,
                description: values.description || '',
                priority: values.priority,
            });
            form.reset();
            onSuccess();
        } catch (error) {
            console.error('Failed to create role:', error);
            // Handle error (e.g., show toast)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('createRole')}</DialogTitle>
                    <DialogDescription>{t('createRoleDescription')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className={form.formState.errors.name ? 'text-red-500' : ''}>
                            {t('name')}
                        </Label>
                        <Input
                            id="name"
                            placeholder={t('namePlaceholder')}
                            {...form.register('name')}
                            onChange={(e) => {
                                form.register('name').onChange(e);
                                handleNameChange(e);
                            }}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm font-medium text-red-500">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className={form.formState.errors.slug ? 'text-red-500' : ''}>
                            {t('slug')}
                        </Label>
                        <Input
                            id="slug"
                            placeholder={t('slugPlaceholder')}
                            {...form.register('slug')}
                        />
                        {form.formState.errors.slug && (
                            <p className="text-sm font-medium text-red-500">{form.formState.errors.slug.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority" className={form.formState.errors.priority ? 'text-red-500' : ''}>
                            {t('priority')}
                        </Label>
                        <Input
                            id="priority"
                            type="number"
                            {...form.register('priority', { valueAsNumber: true })}
                        />
                        {form.formState.errors.priority && (
                            <p className="text-sm font-medium text-red-500">{form.formState.errors.priority.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className={form.formState.errors.description ? 'text-red-500' : ''}>
                            {t('description')}
                        </Label>
                        <Textarea
                            id="description"
                            placeholder={t('descriptionPlaceholder')}
                            {...form.register('description')}
                        />
                        {form.formState.errors.description && (
                            <p className="text-sm font-medium text-red-500">{form.formState.errors.description.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
