import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { Provider } from 'react-redux';
import { persistor, store } from '@/stores';
import { PersistGate } from 'redux-persist/integration/react';
import { vi } from 'date-fns/locale/vi';
import { setDefaultOptions } from 'date-fns';

setDefaultOptions({ locale: vi });
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    </StrictMode>,
);
