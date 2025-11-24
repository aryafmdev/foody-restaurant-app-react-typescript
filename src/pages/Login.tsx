import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { useLoginMutation } from '../services/queries/auth';
import { setToken, setUserId } from '../features/auth/slice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useLoginMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login.mutateAsync({ email, password });
    const token = res.data.token;
    const userId = String(res.data.user.id);
    dispatch(setToken(token));
    dispatch(setUserId(userId));
    navigate('/');
  };

  return (
    <div className="mx-auto p-2xl">
      <Card>
        <CardHeader>
          <div className="text-lg font-bold">Login</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-md">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={login.isPending} className="w-full">{login.isPending ? 'Signing in...' : 'Login'}</Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="link" onClick={() => navigate('/register')}>Register</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
