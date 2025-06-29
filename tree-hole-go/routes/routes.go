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
		// 树洞相关路由
		treehole := api.Group("/treehole")
		{
			treehole.GET("", handlers.GetComments)                        // 获取评论列表（支持分页和排序）
			treehole.GET("/author/:author", handlers.GetCommentsByAuthor) // 按作者查询
			treehole.GET("/search", handlers.GetCommentsBySearch)         // 关键词搜索
			treehole.GET("/static", handlers.GetUserStatistics)           // 用户统计数据
		}
		aish := api.Group("/aish")
		{
			aish.GET("/posts", handlers.QueryAishPost)
		}
	}

	return r
}
