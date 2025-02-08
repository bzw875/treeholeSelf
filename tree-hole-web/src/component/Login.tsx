import { useState } from 'react';
import { backendAPI } from '../backendAPI';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const rps = await backendAPI.login(username, password);
            const {data} = rps;
            if (data.token) {
                localStorage.setItem('userInfo', JSON.stringify({username, token: data.token}));
            }
        } catch(e: any) {
            console.error(e);
            setErrMsg(e.message);
            setTimeout(() => {
                setErrMsg('');
            }, 3000);
        }
    }
    }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;