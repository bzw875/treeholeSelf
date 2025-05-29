package models

// UserStatistics 用户统计数据
type UserStatistics struct {
	Author           string `json:"author"`            // 用户名
	TotalLikes       int    `json:"total_likes"`       // 总点赞数
	TotalDislikes    int    `json:"total_dislikes"`    // 总点踩数
	CommentsReceived int    `json:"comments_received"` // 收到的评论数
	ArticlesPosted   int    `json:"articles_posted"`   // 发表的文章数
}

type Response2 struct {
	Code int                `json:"code"`
	Msg  string             `json:"msg"`
	Data StatisticsResponse `json:"data"`
}

// StatisticsResponse 统计数据响应
type StatisticsResponse struct {
	Total int              `json:"total"`
	List  []UserStatistics `json:"list"`
}
