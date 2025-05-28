import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', // 你的后端 API 服务器地址
        changeOrigin: true,
        bypass: (req, res) => {
          // 转发特定的请求头
          res.setHeader('Authorization', req.headers['authorization'] || '');
        },
      },
    },
  },
});

