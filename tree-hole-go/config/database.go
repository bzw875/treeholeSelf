package config

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
}

func GetDatabaseConfig() *DatabaseConfig {
	return &DatabaseConfig{
		Host:     "localhost",
		Port:     3306,
		User:     "root",
		Password: "J(87h9IU838UY*#H8yOJ",
		DBName:   "jandan",
	}
}
