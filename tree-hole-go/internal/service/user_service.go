package service

import (
	"context"
	"errors"
	"fmt"

	"treehole/internal/repository"
)

// UserService 用户服务接口
type UserService interface {
	CreateUser(ctx context.Context, name, email string, age int) (int64, error)
	GetUserByID(ctx context.Context, id int64) (*repository.User, error)
}

// UserServiceImpl 用户服务实现
type UserServiceImpl struct {
	userRepo repository.UserRepository
}

// NewUserService 创建用户服务实例
func NewUserService(userRepo repository.UserRepository) UserService {
	return &UserServiceImpl{userRepo: userRepo}
}

// CreateUser 创建用户
func (s *UserServiceImpl) CreateUser(ctx context.Context, name, email string, age int) (int64, error) {
	// 业务逻辑验证
	if name == "" {
		return 0, errors.New("用户名不能为空")
	}
	if age <= 0 {
		return 0, errors.New("年龄必须大于0")
	}

	// 调用数据访问层
	userID, err := s.userRepo.CreateUser(name, email, age)
	if err != nil {
		return 0, fmt.Errorf("服务层创建用户失败: %w", err)
	}

	// 其他业务逻辑...

	return userID, nil
}

// GetUserByID 根据ID获取用户
func (s *UserServiceImpl) GetUserByID(ctx context.Context, id int64) (*repository.User, error) {
	// 业务逻辑验证
	if id <= 0 {
		return nil, errors.New("无效的用户ID")
	}

	// 调用数据访问层
	user, err := s.userRepo.GetUserByID(id)
	if err != nil {
		return nil, fmt.Errorf("服务层获取用户失败: %w", err)
	}

	return user, nil
}
