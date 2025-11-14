package service

import (
	"errors"
	"treehole/database"
	"treehole/models"

	"gorm.io/gorm"
)

// Login 用户登录
func Login(req models.LoginRequest) (*models.User, error) {
	var user models.User

	// 查找用户
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("用户名或密码错误")
		}
		return nil, errors.New("查询用户失败")
	}

	// 验证密码
	if user.Password != req.Password {
		return nil, errors.New("用户名或密码错误")
	}

	return &user, nil
}

// GetUserByID 根据ID获取用户
func GetUserByID(userID uint) (*models.User, error) {
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
