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

	// 设置 cookie（有效期 7 天）
	c.SetCookie(
		"token",    // cookie 名称
		token,      // cookie 值
		7*24*60*60, // 过期时间（秒），7天
		"/",        // 路径
		"",         // 域名（空表示当前域名）
		false,      // 是否只在 HTTPS 下传输
		true,       // 是否禁止 JavaScript 访问（HttpOnly）
	)

	response := models.AuthResponse{
		Code: 200,
		Msg:  "登录成功",
	}
	response.Data.UserID = user.ID
	response.Data.Username = user.Username

	c.JSON(http.StatusOK, response)
}

func Logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, models.AuthResponse{
		Code: 200,
		Msg:  "退出成功",
	})
}

// GetTokenUserID 从 token 获取用户ID（用于中间件）
func GetTokenUserID(token string) (uint, bool) {
	userID, exists := tokenStore[token]
	return userID, exists
}

// AuthMiddleware 认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从 cookie 中获取 token
		token, err := c.Cookie("token")
		if err != nil || token == "" {
			c.JSON(http.StatusUnauthorized, models.AuthResponse{
				Code: 401,
				Msg:  "未提供认证 token",
			})
			c.Abort()
			return
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
