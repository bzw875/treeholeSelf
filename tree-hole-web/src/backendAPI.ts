import {
	SortEnum,
	FieldEnum,
	RangeNum,
	TreeHoleType,
	StatisticsType,
} from "./interface";
import axios from "axios";

let baseURL = "/backend";

if (import.meta.env.DEV) {
	baseURL = "/api";
} else if (import.meta.env.PROD) {
	baseURL = "/api";
}

const instance = axios.create({
	baseURL,
	timeout: 100000,
	maxRedirects: 0,
	withCredentials: true,
});

// 请求拦截器
instance.interceptors.request.use(
	(config) => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
		if (userInfo && userInfo.token) {
			config.headers.Authorization = `Bearer ${userInfo.token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response) => {
		console.log(response);
		if (response.data.code === 401) {
			localStorage.removeItem("userInfo");
		}
		return response;
	},
	(error) => {
		console.log(error);
		return Promise.reject(error);
	},
);

interface queryType {
	page: number;
	size: number;
	sort: SortEnum;
	field: FieldEnum;
	likeRange: string;
}

interface ResponseType<T> {
	code: number;
	data: {
		list: T[];
		total: number;
	};
}

export const backendAPI = {
	fetchAllTreeHole: (params: queryType) => {
		const p = {
			...params,
			likeRange: params.likeRange === RangeNum.NoLimit ? "" : params.likeRange,
			page: String(params.page),
			size: String(params.size),
		};
		return instance.get<ResponseType<TreeHoleType>>(
			"/treehole?" + new URLSearchParams(p),
		);
	},

	findByAuthor: (author: string) => {
		return instance.get<ResponseType<TreeHoleType>>(
			"/treehole/author/" + author,
		);
	},

	searchTreeHole: (keyword: string) => {
		return instance.get<ResponseType<TreeHoleType>>(
			"/treehole/search?q=" + keyword,
		);
	},
	login: (username: string, password: string) => {
		return instance.get(
			"/login?username=" + username + "&password=" + password,
		);
	},

	fetchStatistics: () => {
		return instance.get<ResponseType<StatisticsType>>("/treehole/static");
	},

	fetchAish123: () => {
		return instance.get<ResponseType<TreeHoleType>>("/aish/posts");
	},

	queryAi: (prompt: string) => {
		const data = {
			model: "doubao-seed-1-6-flash-250615",
			messages: [
				{
					content: [
						{
							text: prompt,
							type: "text",
						},
					],
					role: "user",
				},
			],
			stream: false,
		};
		return instance.post("/agent/doubao", data);
	},
};

// export const queryAi = async (prompt: string) => {
//   const doubaoUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

//   return axios.post(doubaoUrl, {
//       model: 'doubao-seed-1-6-flash-250615',
//       messages: [{
//           content: [{
//               text: prompt,
//               type: 'text'
//           }],
//           role: 'user'
//       }],
//       stream: false
//   }, {
//       headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer f29e2b54-b1e8-42ae-9155-080f22feb686`
//       }
//   })
// }
