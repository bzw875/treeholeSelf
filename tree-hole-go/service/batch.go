package service

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"
	"treehole/database"
	"treehole/models"

	"gorm.io/gorm/clause"
)

func Batch() {
	// 初始化数据库连接
	if err := database.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// 自动迁移数据库结构
	if err := database.DB.AutoMigrate(&models.Comment{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	endPage := 1 // 最后一页

	for page := 1000; page <= endPage; page++ {

		err, responseString := Reptile("https://jandan.net/api/comment/post/102312?order=desc&page=" + strconv.Itoa(page))
		if err != nil {
			log.Fatal("Error fetching data:", err, page)
		}

		// 解析JSON数据
		var response models.Response
		if err := json.Unmarshal([]byte(responseString), &response); err != nil {
			log.Fatalf("解析JSON失败: %v", err, page)
		}

		// 保存评论到数据库
		if err := database.DB.Clauses(clause.OnConflict{
			UpdateAll: true,
		}).Create(&response.Data.List).Error; err != nil {
			log.Fatal("Error saving comments:", err, page)
		}

		fmt.Println("Successfully saved comments to database, page:", page, "count:", len(response.Data.List))
		time.Sleep(3 * time.Second)
	}
}
