import { useState } from 'react';
import { backendAPI } from '../backendAPI';
import { message } from 'antd';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await backendAPI.login(username, password);
            location.href = '/';
        } catch(e: unknown) {
          setPassword('');
          message.error('Login failed' + e);
        }
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;