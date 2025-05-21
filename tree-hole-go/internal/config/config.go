package config

import "fmt"

// Config 应用配置结构
type Config struct {
	Database struct {
		Host     string
		Port     int
		User     string
		Password string
		Name     string
	}
	Server struct {
		Port int
	}
}

// LoadConfig 加载应用配置
func LoadConfig() (*Config, error) {
	cfg := &Config{
		Database: struct {
			Host     string
			Port     int
			User     string
			Password string
			Name     string
		}{
			Host:     "localhost",
			Port:     3306,
			User:     "user",
			Password: "password",
			Name:     "dbname",
		},
		Server: struct{ Port int }{Port: 8080},
	}
	// 实际项目中可从文件、环境变量或配置中心加载
	fmt.Println("配置加载成功")
	return cfg, nil
}
