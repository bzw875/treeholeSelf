import { SortEnum, FieldEnum, RangeNum } from "./interface";
import axios from 'axios';

let baseURL = '/backend';

if (import.meta.env.DEV) {
  baseURL = '/backend';
} else if (import.meta.env.PROD) {
  baseURL = '/backend';
}


const instance = axios.create({
  baseURL,
  timeout: 100000,
  maxRedirects: 0,
  withCredentials: true,
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
   
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    console.log(response);
    return response;
  },
  (error, response) => {
    console.log(error, response);
    return Promise.reject(error);
  }
);


interface queryType {
    page: number;
    size: number;
    sort: SortEnum;
    field: FieldEnum;
    likeRange: string;
}

export const backendAPI = {
    fetchAllTreeHole: (params: queryType) => {
        const p = {
            ...params,
            likeRange: params.likeRange === RangeNum.NoLimit ? '' : params.likeRange,
            page: String(params.page),
            size: String(params.size)
        };
        return instance.get('/treeHole?' + new URLSearchParams(p));
    },

    findByAuthor: (author: string) => {
        return instance.get('/treeHole/author/' + author);
    },
    
    searchTreeHole: (keyword: string) => {
        return instance.get('/treeHole/search?q=' + keyword)
    },
    login: (username: string, password: string) => {
        return instance.get(`/api/login?username=${username}&password=${password}`);
    },
}