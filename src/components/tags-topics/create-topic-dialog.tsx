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
import { TopicsService } from '@/services/topics-service';
import { toastService } from '@/services/toasts-service';
import { useTranslations } from 'next-intl';

interface CreateTopicDialogProps {
    onSuccess: () => void;
}

export function CreateTopicDialog({ onSuccess }: CreateTopicDialogProps) {
    const t = useTranslations('CreateTopicDialog');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1, t('topicNameRequired')).max(50, t('topicNameTooLong')),
        slug: z.string().optional(),
        description: z.string().min(1, t('descriptionRequired')).max(200, t('descriptionTooLong')),
    });

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
            await TopicsService.createTopic(values);
            toastService.success(t('createTopicSuccess'));
            setOpen(false);
            form.reset();
            onSuccess();
        } catch (error) {
            console.error('Failed to create topic:', error);
            toastService.error(t('createTopicError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('createTopicButton')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] data-[state=open]:slide-in-from-top-0">
                <DialogHeader>
                    <DialogTitle>{t('createTopicTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('createTopicDescription')}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('nameLabel')}</Label>
                        <Input
                            id="name"
                            placeholder={t('namePlaceholder')}
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
                        <Label htmlFor="slug">{t('slugLabel')}</Label>
                        <Input
                            id="slug"
                            placeholder={t('slugPlaceholder')}
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...form.register('slug')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">{t('descriptionLabel')}</Label>
                        <Input
                            id="description"
                            placeholder={t('descriptionPlaceholder')}
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
                            {loading ? t('creating') : t('create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
