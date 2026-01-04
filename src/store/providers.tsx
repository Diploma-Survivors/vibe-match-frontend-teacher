'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './index';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTags, fetchTopics, fetchLanguages } from './slices/metadata-slice';
import type { AppDispatch } from './index';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTags());
    dispatch(fetchTopics());
    dispatch(fetchLanguages());
  }, [dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppInitializer>{children}</AppInitializer>
      </PersistGate>
    </Provider>
  );
}
