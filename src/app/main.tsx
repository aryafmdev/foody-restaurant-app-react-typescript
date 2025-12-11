import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTokenProvider } from '../services/api/http';
import { setToken, setUserId, setUser } from '../features/auth/slice';

const queryClient = new QueryClient();

setTokenProvider(() => store.getState().auth.token);

try {
  const fromLocal = localStorage.getItem('auth');
  const fromSession = sessionStorage.getItem('auth');
  const raw = fromLocal ?? fromSession;
  if (raw) {
    const parsed = JSON.parse(raw) as {
      token?: string;
      userId?: string;
      user?: {
        id?: string | number;
        name?: string;
        email?: string;
        phone?: string;
        avatar?: string;
        latitude?: number;
        longitude?: number;
      };
    };
    if (parsed?.token) store.dispatch(setToken(parsed.token));
    if (parsed?.userId) store.dispatch(setUserId(parsed.userId));
    if (parsed?.user) {
      const u = parsed.user;
      store.dispatch(
        setUser({
          id: typeof u.id === 'number' ? String(u.id) : (u.id ?? null),
          name: u.name ?? null,
          email: u.email ?? null,
          phone: u.phone ?? null,
          avatar: u.avatar ?? null,
          address: (u as { address?: string }).address ?? null,
          latitude: u.latitude ?? null,
          longitude: u.longitude ?? null,
        })
      );
      try {
        const latOk = typeof u.latitude === 'number' && isFinite(u.latitude);
        const longOk = typeof u.longitude === 'number' && isFinite(u.longitude);
        if (latOk && longOk) {
          localStorage.setItem(
            'userlocation',
            JSON.stringify({ latitude: u.latitude, longitude: u.longitude })
          );
        }
      } catch {
        void 0;
      }
    }
  }
} catch {
  void 0;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
