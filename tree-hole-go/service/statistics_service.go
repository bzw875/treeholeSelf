package service

import (
	"treehole/database"
	"treehole/models"
)

// GetUserStatistics 获取用户统计数据
func GetUserStatistics() (models.Response2, error) {
	var response models.Response2
	var statistics []models.UserStatistics

	// 使用SQL查询来获取统计数据
	query := `
		SELECT 
			author,
			SUM(vote_positive) as total_likes,
			SUM(vote_negative) as total_dislikes,
			SUM(sub_comment_count) as comments_received,
			COUNT(*) as articles_posted
		FROM comments 
		GROUP BY author
		HAVING total_likes > 1000 OR total_dislikes > 1000 OR comments_received > 1000
		ORDER BY total_likes DESC
	`

	if err := database.DB.Raw(query).Find(&statistics).Error; err != nil {
		return response, err
	}

	response.Data.Total = len(statistics)
	response.Data.List = statistics
	return response, nil
}
