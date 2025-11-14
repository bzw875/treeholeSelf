package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"
	"treehole/models"
	"treehole/service"

	"github.com/gin-gonic/gin"
)

// 简单的 token 存储（生产环境应使用 Redis 或数据库）
var tokenStore = make(map[string]uint)

// generateToken 生成简单的 token
func generateToken(userID uint) string {
	timestamp := time.Now().Unix()
	data := fmt.Sprintf("%d-%d-%d", userID, timestamp, time.Now().UnixNano())
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// Login 用户登录
func Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{
			Code: 400,
			Msg:  "参数错误: " + err.Error(),
		})
		return
	}

	user, err := service.Login(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.AuthResponse{
			Code: 401,
			Msg:  err.Error(),
		})
		return
	}

	// 生成 token
	token := generateToken(user.ID)
	tokenStore[token] = user.ID

	response := models.AuthResponse{
		Code: 200,
		Msg:  "登录成功",
	}
	response.Data.Token = token
	response.Data.UserID = user.ID
	response.Data.Username = user.Username

	c.JSON(http.StatusOK, response)
}

// GetTokenUserID 从 token 获取用户ID（用于中间件）
func GetTokenUserID(token string) (uint, bool) {
	userID, exists := tokenStore[token]
	return userID, exists
}

// AuthMiddleware 认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			// 尝试从 query 参数获取
			token = c.Query("token")
		}

		if token == "" {
			c.JSON(http.StatusUnauthorized, models.AuthResponse{
				Code: 401,
				Msg:  "未提供认证 token",
			})
			c.Abort()
			return
		}

		// 移除 "Bearer " 前缀（如果存在）
		if len(token) > 7 && token[:7] == "Bearer " {
			token = token[7:]
		}

		userID, exists := GetTokenUserID(token)
		if !exists {
			c.JSON(http.StatusUnauthorized, models.AuthResponse{
				Code: 401,
				Msg:  "无效的 token",
			})
			c.Abort()
			return
		}

		// 将用户ID存储到上下文中
		c.Set("userID", userID)
		c.Next()
	}
}
