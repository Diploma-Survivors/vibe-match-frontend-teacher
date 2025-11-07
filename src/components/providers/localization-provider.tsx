import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface AppLocalizationProviderProps {
  readonly children: React.ReactNode;
}

export default function AppLocalizationProvider({
  children,
}: AppLocalizationProviderProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
}
