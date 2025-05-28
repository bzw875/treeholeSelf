package routes

import (
	"treehole/handlers"

	"github.com/gin-gonic/gin"
)

// SetupRouter 配置所有路由
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// API 路由组
	api := r.Group("/api")
	{
		// 树洞相关路由
		treehole := api.Group("/treehole")
		{
			treehole.GET("", handlers.GetComments)                        // 获取评论列表（支持分页和排序）
			treehole.GET("/author/:author", handlers.GetCommentsByAuthor) // 按作者查询
			treehole.GET("/search", handlers.GetCommentsBySearch)         // 关键词搜索
		}
	}

	return r
}
