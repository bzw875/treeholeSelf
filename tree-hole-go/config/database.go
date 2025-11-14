package config

import (
	"os"
)

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
}

var (
	hostName = "localhost"
	port     = 3306
	user     = "root"
	dbName   = "jandan"
)

func GetDatabaseConfig() *DatabaseConfig {
	env := os.Getenv("GO_ENV")
	if env == "" {
		env = "development"
	}

	switch env {
	case "production":
		return getProductionConfig()
	default:
		return getDevelopmentConfig()
	}
}

func getDevelopmentConfig() *DatabaseConfig {
	return &DatabaseConfig{
		Host:     hostName,
		Port:     port,
		User:     user,
		Password: "J(87h9IU838UY*#H8yOJ",
		DBName:   dbName,
	}
}

func getProductionConfig() *DatabaseConfig {

	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "" // 生产环境建议必须设置密码
	}

	return &DatabaseConfig{
		Host:     hostName,
		Port:     port,
		User:     user,
		Password: password,
		DBName:   dbName,
	}
}
