'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import PermissionsTab from '@/components/admin/roles/permissions-tab';
import RolesTab from '@/components/admin/roles/roles-tab';

export default function RolesPage() {
    const t = useTranslations('RolesPage');
    const [activeTab, setActiveTab] = useState('roles');

    return (
        <div className="container mx-auto py-8 px-6 max-w-7xl">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {t('title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('description')}
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                        <TabsTrigger value="roles">{t('rolesTab')}</TabsTrigger>
                        <TabsTrigger value="permissions">{t('permissionsTab')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="roles" className="mt-0">
                        <RolesTab />
                    </TabsContent>

                    <TabsContent value="permissions" className="mt-0">
                        <PermissionsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
