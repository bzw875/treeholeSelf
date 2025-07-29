import { useState } from "react";
import { Input, Button, Card, Typography, Space, Spin, message } from "antd";
import { SendOutlined, RobotOutlined } from "@ant-design/icons";
import { backendAPI } from "../backendAPI";

const { TextArea } = Input;

// 简单的 markdown 解析函数
const parseMarkdown = (text: string): string => {
	return text
		// 处理标题
		.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
		.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h2>')
		.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-800 mt-8 mb-4">$1</h1>')
		// 处理粗体
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
		// 处理斜体
		.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
		// 处理代码块
		.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm text-gray-800">$1</code></pre>')
		// 处理行内代码
		.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
		// 处理链接
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
		// 处理列表
		.replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
		.replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
		// 处理换行
		.replace(/\n/g, '<br>')
		// 包装列表项
		.replace(/(<li class="ml-4 mb-1">.*<\/li>)/g, '<ul class="list-disc my-4">$1</ul>')
		// 清理多余的 ul 标签
		.replace(/<\/ul>\s*<ul class="list-disc my-4">/g, '');
};

const AiAgent = () => {
	const [promptInput, setPromptInput] = useState("AI怎么实现记住之前的聊天记录呢");
	const [suggestions, setSuggestions] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPromptInput(e.target.value);
	};

	const sendPrompt = async () => {
		if (!promptInput.trim()) {
			message.warning("请输入内容");
			return;
		}

		setLoading(true);
		try {
			const { data } = await backendAPI.queryAi(promptInput);
			setSuggestions(data.choices[0].message.content);
			message.success("AI 回复成功");
		} catch (error) {
			message.error("请求失败，请重试");
			console.error("AI 请求错误:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && e.ctrlKey) {
			sendPrompt();
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
				<div className="text-center mb-6">
					<RobotOutlined className="text-4xl text-blue-600 mb-2" />
				</div>

				<Space direction="vertical" size="large" className="w-full">
					{/* 输入区域 */}
					<div>
						<TextArea
							placeholder="请输入您的问题..."
							value={promptInput}
							onChange={handleChange}
							onKeyPress={handleKeyPress}
							autoSize={{ minRows: 4, maxRows: 8 }}
							className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
							disabled={loading}
						/>
						<div className="text-xs text-gray-500 mt-2">
							提示：按 Ctrl + Enter 快速发送
						</div>
					</div>

					{/* 发送按钮 */}
					<div className="text-center">
						<Button
							type="primary"
							size="large"
							icon={<SendOutlined />}
							onClick={sendPrompt}
							loading={loading}
							className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 px-8 h-12 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
						>
							{loading ? "AI 思考中..." : "发送给 AI"}
						</Button>
					</div>

					{/* 结果展示区域 */}
					{suggestions && (
						<Card
							title={
								<div className="flex items-center">
									<RobotOutlined className="text-blue-600 mr-2" />
									<span className="text-gray-800">AI 回复</span>
								</div>
							}
							className="bg-white border-l-4 border-l-blue-500 shadow-md"
						>
							{loading ? (
								<div className="text-center py-8">
									<Spin size="large" />
									<div className="mt-4 text-gray-600">AI 正在思考中...</div>
								</div>
							) : (
								<div className="prose max-w-none">
									<div 
										className="text-gray-700 leading-relaxed"
										dangerouslySetInnerHTML={{ __html: parseMarkdown(suggestions) }}
									/>
								</div>
							)}
						</Card>
					)}
				</Space>
			</Card>
		</div>
	);
};

export default AiAgent;
