package service

import (
	"treehole/database"
	"treehole/models"
)

func GetAishAll() (models.Response3, error) {
	var response models.Response3
	var posts []models.Aish

	query := `
		SELECT * FROM aish
	`

	if err := database.DB.Raw(query).Find(&posts).Error; err != nil {
		return models.Response3{}, err
	}

	response.Data.List = posts
	response.Data.Total = len(posts)
	return response, nil
}
