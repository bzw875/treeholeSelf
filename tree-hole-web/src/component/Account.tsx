import { useEffect, useState } from 'react'
import { backendAPI } from '../backendAPI';

function Account() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('111111');
    const [token, setToken] = useState('');
    useEffect(()=> {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.username && userInfo.token) {
            setToken(userInfo.token);
            return;
        }
    },[])

    const handleLogin = async () => {
        const rps = await backendAPI.login(username, password);
        const {data} = rps;
        if (data.token) {
            localStorage.setItem('userInfo', JSON.stringify({username, token: data.token}));
            setToken(data.token);
        }
    }

    const handleLoginOut =  () => {
        localStorage.removeItem('userInfo');
        setToken('');
    }
  
  return (
    <div>
        {token ? <button onClick={handleLoginOut}>{username} ⎋</button> : <div>
            <input type="text" placeholder='username' value={username} onInput={(e)=>{setUsername(e.target.value)}} />
            <input type="text" placeholder='password' value={password} onInput={(e)=>{setPassword(e.target.value)}} />
            <button onClick={handleLogin}>login</button>
        </div>}
    </div>
  );
}

export default Account

