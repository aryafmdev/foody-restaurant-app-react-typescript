import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTokenProvider } from '../services/api/http';
import { setToken, setUserId } from '../features/auth/slice';

const queryClient = new QueryClient();

setTokenProvider(() => store.getState().auth.token);

try {
  const fromLocal = localStorage.getItem('auth');
  const fromSession = sessionStorage.getItem('auth');
  const raw = fromLocal ?? fromSession;
  if (raw) {
    const parsed = JSON.parse(raw) as { token?: string; userId?: string };
    if (parsed?.token) store.dispatch(setToken(parsed.token));
    if (parsed?.userId) store.dispatch(setUserId(parsed.userId));
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
