package routes

import (
	"treehole/handlers"

	"github.com/gin-gonic/gin"
)

// SetupRouter 配置所有路由
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// 配置静态资源
	r.Static("/assets", "./static/assets")

	// API 路由组
	// 所有非 /api 的路由都定向到静态文件
	r.NoRoute(func(c *gin.Context) {
		if c.Request.URL.Path != "/api" {
			c.File("./static/index.html")
		}
	})
	api := r.Group("/api")
	{
		// 认证相关路由
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Login)   // 用户登录
			auth.POST("/logout", handlers.Logout) // 用户退出
		}

		// 需要登录鉴权的中间件
		authRequired := handlers.AuthMiddleware()

		// 树洞相关路由，需要登录鉴权
		treehole := api.Group("/treehole")
		treehole.Use(authRequired)
		{
			treehole.GET("", handlers.GetComments)                        // 获取评论列表（支持分页和排序）
			treehole.GET("/author/:author", handlers.GetCommentsByAuthor) // 按作者查询
			treehole.GET("/search", handlers.GetCommentsBySearch)         // 关键词搜索
			treehole.GET("/static", handlers.GetUserStatistics)           // 用户统计数据
		}

		// aish相关路由，需要登录鉴权
		aish := api.Group("/aish")
		aish.Use(authRequired)
		{
			aish.GET("/posts", handlers.QueryAishPost)
		}

		// agent相关路由，需要登录鉴权
		agent := api.Group("/agent")
		agent.Use(authRequired)
		{
			agent.POST("/doubao", handlers.ProxyAgent)
		}
	}

	return r
}
