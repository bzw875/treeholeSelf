import { Checkbox } from 'antd';
import { useState } from 'react';

// 定义消息类型
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function QwenChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 发送请求到本地 Ollama 服务
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // 添加用户消息到聊天记录
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen:0.5b',
          messages: [...messages, userMessage],
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      console.error('与模型交互出错:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '无法连接到模型，请确保 Ollama 正在运行且 Qwen1.5-0.5B 已安装' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Qwen1.5-0.5B 聊天</h2>
      
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        height: '400px', 
        overflowY: 'auto', 
        marginBottom: '10px', 
        padding: '10px' 
      }}>
        {messages.map((msg, index) => (
          <div key={`msg-${index}-${Date.now()}`} style={{ 
            marginBottom: '10px', 
            padding: '8px', 
            borderRadius: '4px',
            backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5'
          }}>
            <strong>{msg.role === 'user' ? '你' : 'Qwen'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ color: '#666' }}>Qwen 正在思考...</div>
        )}
      </div>
      
      {/* 输入区域 */}
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="输入消息..."
          style={{ 
            flex: 1, 
            padding: '8px', 
            borderRadius: '4px 0 0 4px', 
            border: '1px solid #ccc', 
            borderRight: 'none' 
          }}
        />
        <button 
          type="button"
          onClick={sendMessage}
          disabled={isLoading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#2196f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0 4px 4px 0', 
            cursor: 'pointer' 
          }}
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
}

export default QwenChat;
