package models

import "time"

type Comment struct {
	ID              int64     `json:"id" gorm:"primaryKey"`
	PostID          int64     `json:"post_id"`
	Author          string    `json:"author"`
	AuthorType      int       `json:"author_type"`
	DateGMT         time.Time `json:"date_gmt"`
	UserID          int64     `json:"user_id"`
	Content         string    `json:"content"`
	VotePositive    int       `json:"vote_positive"`
	VoteNegative    int       `json:"vote_negative"`
	SubCommentCount int       `json:"sub_comment_count"`
	Images          *string   `json:"images"`
	IPLocation      string    `json:"ip_location"`
	CreatedAt       time.Time `gorm:"autoCreateTime"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime"`
}

type Response struct {
	Code int          `json:"code"`
	Msg  string       `json:"msg"`
	Data ResponseData `json:"data"`
}

type ResponseData struct {
	Total int       `json:"total"`
	List  []Comment `json:"list"`
}
