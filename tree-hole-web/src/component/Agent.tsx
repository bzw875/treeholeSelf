import { useState } from "react";
import { Input, Button, Card, Typography, Space, Spin, message } from "antd";
import { SendOutlined, RobotOutlined } from "@ant-design/icons";
import { backendAPI } from "../backendAPI";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

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
									<Paragraph className="text-gray-700 leading-relaxed whitespace-pre-wrap">
										{suggestions}
									</Paragraph>
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
