import Loading from "@/components/ui/loading";
import { useTranslations } from 'next-intl';

export default function RootLoading() {
    const t = useTranslations('Loading');

    return (
        <Loading
            title={t('title')}
            description={t('description')}
        />
    );
}
