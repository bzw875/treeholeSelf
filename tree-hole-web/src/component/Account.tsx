import { useEffect, useState } from 'react'
import { backendAPI } from '../backendAPI';
import Alert from './Alert';

function Account() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [errMsg, setErrMsg] = useState('');
    useEffect(()=> {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.username && userInfo.token) {
            setToken(userInfo.token);
            return;
        }
    },[])

    const handleLogin = async () => {
        try {
            const rps = await backendAPI.login(username, password);
            const {data} = rps;
            if (data.token) {
                localStorage.setItem('userInfo', JSON.stringify({username, token: data.token}));
                setToken(data.token);
            }
        } catch(e: any) {
            console.error(e);
            setErrMsg(e.message);
            setTimeout(() => {
                setErrMsg('');
            }, 3000);
        }
    }

    const handleLoginOut =  () => {
        localStorage.removeItem('userInfo');
        setToken('');
    }
  
  return (
    <div>
        {token ? <button onClick={handleLoginOut}>{username} ⎋</button> : <div>
            <input type="text" placeholder='username' value={username} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{setUsername(e.target.value)}} />
            <input type="text" placeholder='password' value={password} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{setPassword(e.target.value)}} />
            <button onClick={handleLogin}>login</button>
        </div>}
        <Alert message={errMsg} />
    </div>
  );
}

export default Account

