import { Link } from '@/i18n/routing';
import { FileQuestion } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-muted p-6 mb-4">
                    <FileQuestion className="h-20 w-20 text-muted-foreground" />
                </div>

                <h1 className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                    {t('heading')}
                </h1>

                <h2 className="font-heading text-2xl font-semibold sm:text-3xl md:text-4xl">
                    {t('subheading')}
                </h2>

                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    {t('message')}
                </p>
            </div>
        </div>
    );
}
