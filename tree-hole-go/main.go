package main

import (
	"log"
	"treehole/database"
	"treehole/models"
	"treehole/routes"
	"treehole/service"
)

func main() {
	// 初始化数据库连接
	if err := database.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// 自动迁移数据库结构
	if err := database.DB.AutoMigrate(&models.Comment{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	go service.ImportJson()

	// 设置路由
	r := routes.SetupRouter()

	// 启动服务器
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
