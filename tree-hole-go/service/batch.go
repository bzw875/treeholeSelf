package service

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"time"
	"treehole/database"
	"treehole/models"

	"gorm.io/gorm"
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

	endPage := 89 // 最后一页

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

func ImportJson() {
	jsonFile, err := os.Open("tree_hole_202505281403.json")
	if err != nil {
		log.Fatal("Error opening file:", err)
	}
	defer jsonFile.Close()

	byteValue, _ := io.ReadAll(jsonFile)

	type JsonComment struct {
		ID         int    `json:"id"`
		Author     string `json:"author"`
		CommentNum int    `json:"comment_num"`
		Context    string `json:"context"`
		CreatedAt  string `json:"created_at"`
		DataID     string `json:"data_id"`
		DislikeNum int    `json:"dislike_num"`
		LikeNum    int    `json:"like_num"`
		PostDate   string `json:"post_date"`
		UpdatedAt  string `json:"updated_at"`
	}
	var jsonComments []JsonComment
	var comments []models.Comment
	json.Unmarshal(byteValue, &jsonComments)

	for _, jsonComment := range jsonComments {
		postID, err := strconv.ParseInt(jsonComment.DataID, 10, 64)
		if err != nil {
			log.Printf("Error parsing DataID for comment %d: %v", jsonComment.ID, err)
			continue
		}

		// Parse time strings
		dateGMT, err := time.Parse("2006-01-02 15:04:05.999999", jsonComment.PostDate)
		if err != nil {
			log.Printf("Error parsing PostDate for comment %d: %v", jsonComment.ID, err)
			continue
		}

		createdAt, err := time.Parse("2006-01-02 15:04:05.999999", jsonComment.CreatedAt)
		if err != nil {
			log.Printf("Error parsing CreatedAt for comment %d: %v", jsonComment.ID, err)
			continue
		}

		updatedAtTmp := jsonComment.UpdatedAt
		if updatedAtTmp == "" {
			updatedAtTmp = jsonComment.CreatedAt
		}
		updatedAt, err := time.Parse("2006-01-02 15:04:05.999999", updatedAtTmp)
		if err != nil {
			log.Printf("Error parsing UpdatedAt for comment %d: %v", jsonComment.ID, err)
			continue
		}

		comment := models.Comment{
			PostID:          postID,
			Author:          jsonComment.Author,
			DateGMT:         dateGMT,
			Content:         jsonComment.Context,
			VotePositive:    jsonComment.LikeNum,
			VoteNegative:    jsonComment.DislikeNum,
			SubCommentCount: jsonComment.CommentNum,
			Images:          nil,
			IPLocation:      "",
			CreatedAt:       createdAt,
			UpdatedAt:       updatedAt,
		}
		comments = append(comments, comment)
	}

	for _, comment := range comments {
		var existingComment models.Comment
		if err := database.DB.Where("author = ? AND content = ?", comment.Author, comment.Content).First(&existingComment).Error; err == gorm.ErrRecordNotFound {
			if err := database.DB.Create(&comment).Error; err != nil {
				log.Printf("Error creating comment: %v", err)
			} else {
				log.Printf("Successfully created comment: ID=%d, Author=%s", comment.ID, comment.Author)
			}
		}
	}
}
