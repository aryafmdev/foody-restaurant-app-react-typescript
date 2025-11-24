import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { useRegisterMutation } from '../services/queries/auth';
import { setToken, setUserId } from '../features/auth/slice';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const register = useRegisterMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await register.mutateAsync({ name, email, phone, password });
    const token = res.data.token;
    const userId = String(res.data.user.id);
    dispatch(setToken(token));
    dispatch(setUserId(userId));
    navigate('/');
  };

  return (
    <div className="max-w-sm mx-auto p-2xl">
      <Card>
        <CardHeader>
          <div className="text-lg font-bold">Register</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-md">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={register.isPending} className="w-full">{register.isPending ? 'Creating...' : 'Create account'}</Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="link" onClick={() => navigate('/login')}>Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
