import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagsService } from '@/services/tags-service';
import { toastService } from '@/services/toasts-service';
import { Tag } from '@/types/tags';

const formSchema = z.object({
    name: z.string().min(1, 'Tag name is required').max(50, 'Tag name is too long'),
    slug: z.string().optional(),
    description: z.string().optional(),
});

interface EditTagDialogProps {
    tag: Tag | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditTagDialog({ tag, open, onOpenChange, onSuccess }: EditTagDialogProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
        },
    });

    useEffect(() => {
        if (tag) {
            form.reset({
                name: tag.name,
                slug: tag.slug,
                description: tag.description,
            });
        }
    }, [tag, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!tag) return;

        setLoading(true);
        try {
            await TagsService.updateTag(tag.id, values);
            toastService.success('Tag updated successfully');
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error('Failed to update tag:', error);
            toastService.error('Failed to update tag');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] data-[state=open]:slide-in-from-top-0">
                <DialogHeader>
                    <DialogTitle>Edit Tag</DialogTitle>
                    <DialogDescription>
                        Make changes to the tag here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Dynamic Programming"
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            placeholder="e.g. dynamic-programming"
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...form.register('slug')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Tag description"
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...form.register('description')}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
