import { useState } from 'react';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TagsService } from '@/services/tags-service';
import { toastService } from '@/services/toasts-service';

const formSchema = z.object({
    name: z.string().min(1, 'Tag name is required').max(50, 'Tag name is too long'),
    slug: z.string().optional(),
    description: z.string().optional(),
});

interface CreateTagDialogProps {
    onSuccess: () => void;
}

export function CreateTagDialog({ onSuccess }: CreateTagDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            await TagsService.createTag(values);
            toastService.success('Tag created successfully');
            setOpen(false);
            form.reset();
            onSuccess();
        } catch (error) {
            console.error('Failed to create tag:', error);
            toastService.error('Failed to create tag');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">

                    <Plus className="mr-2 h-4 w-4" />
                    Create Tag
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] data-[state=open]:slide-in-from-top-0">
                <DialogHeader>
                    <DialogTitle>Create Tag</DialogTitle>
                    <DialogDescription>
                        Add a new tag to categorize problems.
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
                            {loading ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
