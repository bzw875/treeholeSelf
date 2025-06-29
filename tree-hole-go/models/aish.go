package models

type Aish struct {
	Title         string `json:"title"`
	ArticleUrl    string `json:"articleUrl"`
	ArticleId     string `json:"articleId"`
	Area          string `json:"area"`
	IsNewUserPost bool   `json:"isNewUserPost"`
	Author        string `json:"author"`
	PublishTime   string `json:"publishTime"`
	ReplyCount    int    `json:"replyCount"`
	ReadCount     int    `json:"readCount"`
	LastReplier   string `json:"lastReplier"`
	LastReplyTime string `json:"lastReplyTime"`
}

type Response3 struct {
	Code int          `json:"code"`
	Msg  string       `json:"msg"`
	Data aishResponse `json:"data"`
}

type aishResponse struct {
	Total int    `json:"total"`
	List  []Aish `json:"list"`
}
