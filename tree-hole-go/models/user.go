package models

import "time"

// User 用户模型
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"uniqueIndex;not null;size:50"`
	Password  string    `json:"-" gorm:"not null;size:255"` // 不返回密码字段
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse 认证响应
type AuthResponse struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data struct {
		Token    string `json:"token,omitempty"`
		UserID   uint   `json:"user_id,omitempty"`
		Username string `json:"username,omitempty"`
	} `json:"data,omitempty"`
}
