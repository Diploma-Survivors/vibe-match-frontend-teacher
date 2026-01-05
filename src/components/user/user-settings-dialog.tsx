'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useApp } from '@/contexts/app-context';
import { ChangePasswordDialog } from './change-password-dialog';

export function UserSettingsDialog() {
    const t = useTranslations('Auth');
    const { user } = useApp();
    const [open, setOpen] = useState(false);

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('userSettings')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>{t('username')}</Label>
                        <Input value={user.username} disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label>{t('email')}</Label>
                        <Input value={user.email} disabled />
                    </div>
                    <div className="flex justify-end">
                        <ChangePasswordDialog />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
