import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { router } from './router';
import { store } from './store';

const queryClient = new QueryClient()

export function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={{ breakpoints: { xxs: '26.875em', xs: '36em', sm: '48em', md: '62em', lg: '80em', xl: '88em' } }}>
                    <RouterProvider router={router} />
                </MantineProvider>
            </QueryClientProvider>
        </Provider>
    )
}