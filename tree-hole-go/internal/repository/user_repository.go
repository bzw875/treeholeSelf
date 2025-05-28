package repository

import (
    "database/sql"
    "fmt"
)

// UserRepository 用户数据访问接口
type UserRepository interface {
    CreateUser(name, email string, age int) (int64, error)
    GetUserByID(id int64) (*User, error)
}

// User 用户模型
type User struct {
    ID    int64  `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
    Age   int    `json:"age"`
}

// MySQLUserRepository MySQL实现的用户数据访问
type MySQLUserRepository struct {
    db *sql.DB
}

// NewMySQLUserRepository 创建MySQL用户数据访问实例
func NewMySQLUserRepository(db *sql.DB) *MySQLUserRepository {
    return &MySQLUserRepository{db: db}
}

// CreateUser 创建用户
func (r *MySQLUserRepository) CreateUser(name, email string, age int) (int64, error) {
    result, err := r.db.Exec("INSERT INTO users (name, email, age) VALUES (?, ?, ?)", name, email, age)
    if err != nil {
        return 0, fmt.Errorf("创建用户失败: %w", err)
    }
    return result.LastInsertId()
}

// GetUserByID 根据ID获取用户
func (r *MySQLUserRepository) GetUserByID(id int64) (*User, error) {
    var user User
    err := r.db.QueryRow("SELECT id, name, email, age FROM users WHERE id = ?", id).
        Scan(&user.ID, &user.Name, &user.Email, &user.Age)
    if err != nil {
        return nil, fmt.Errorf("获取用户失败: %w", err)
    }
    return &user, nil
}    