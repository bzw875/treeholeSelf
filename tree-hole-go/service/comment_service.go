package service

import (
	"strings"
	"treehole/database"
	"treehole/models"
)

// /treeHole?page=0&size=20&field=postDate&sort=DESC&likeRange=
type CommentQuery struct {
	Page      int    `form:"page" binding:"min=0"` // 页码，从0开始
	Size      int    `form:"size" binding:"required,min=1,max=100"`
	Field     string `form:"field"`                         // 排序字段
	Sort      string `form:"sort" binding:"oneof=ASC DESC"` // 排序方向
	LikeRange string `form:"likeRange"`                     // 点赞范围
}

func GetComments(query CommentQuery) (models.ResponseData, error) {
	var result models.ResponseData
	var comments []models.Comment
	db := database.DB

	// http://dev.soulapp-inc.cn:8080/#?page=0&size=20&sort=DESC&field=date_gmt&likeRange=101-200

	// 设置默认值
	if query.Page < 0 {
		query.Page = 0
	}
	if query.Size == 0 {
		query.Size = 10
	}
	if query.Field == "" {
		query.Field = "date_gmt"
	}
	if query.Sort == "" {
		query.Sort = "DESC"
	}

	if query.LikeRange != "" {
		// Parse like range in format "min-max"
		if ranges := strings.Split(query.LikeRange, "-"); len(ranges) == 2 {
			minLikes, maxLikes := ranges[0], ranges[1]
			if maxLikes == "∞" {
				db = db.Where("vote_positive >= ?", minLikes)
			} else {
				db = db.Where("vote_positive BETWEEN ? AND ?", minLikes, maxLikes)
			}
		}
	}

	// 获取总数
	var total int64
	if err := db.Model(&models.Comment{}).Count(&total).Error; err != nil {
		return result, err
	}
	result.Total = int(total)

	// 分页查询
	offset := query.Page * query.Size
	db = db.Offset(offset).Limit(query.Size)

	// 添加排序
	orderStr := query.Field + " " + query.Sort
	db = db.Order(orderStr)

	// 执行查询
	if err := db.Find(&comments).Error; err != nil {
		return result, err
	}

	result.List = comments
	return result, nil
}

func GetCommentsByAuthor(author string) (models.ResponseData, error) {
	var result models.ResponseData
	var comments []models.Comment
	db := database.DB

	db = db.Where("author = ?", author)
	db = db.Order("date_gmt DESC")

	if err := db.Find(&comments).Error; err != nil {
		return result, err
	}

	result.List = comments
	return result, nil
}

func GetCommentsBySearch(keyword string) (models.ResponseData, error) {
	var result models.ResponseData
	var comments []models.Comment
	db := database.DB

	db = db.Where("content LIKE ?", "%"+keyword+"%")
	db = db.Order("date_gmt DESC")

	if err := db.Find(&comments).Error; err != nil {
		return result, err
	}

	result.List = comments
	return result, nil
}
