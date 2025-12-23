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
import { TopicsService } from '@/services/topics-service';
import { toastService } from '@/services/toasts-service';
import { Topic } from '@/types/topics';

const formSchema = z.object({
    name: z.string().min(1, 'Topic name is required').max(50, 'Topic name is too long'),
    slug: z.string().optional(),
    description: z.string().optional(),
});

interface EditTopicDialogProps {
    topic: Topic | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditTopicDialog({ topic, open, onOpenChange, onSuccess }: EditTopicDialogProps) {
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
        if (topic) {
            form.reset({
                name: topic.name,
                slug: topic.slug,
                description: topic.description || '',
            });
        }
    }, [topic, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!topic) return;

        setLoading(true);
        try {
            await TopicsService.updateTopic(topic.id, values);
            toastService.success('Topic updated successfully');
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error('Failed to update topic:', error);
            toastService.error('Failed to update topic');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] data-[state=open]:slide-in-from-top-0">
                <DialogHeader>
                    <DialogTitle>Edit Topic</DialogTitle>
                    <DialogDescription>
                        Make changes to the topic here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Algorithms"
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
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Topic description"
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...form.register('description')}
                        />
                        {form.formState.errors.description && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.description.message}
                            </p>
                        )}
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
