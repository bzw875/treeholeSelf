## 部署
export DB_PASSWORD=password
export GO_ENV=production

# 打包
go build -o treeHoleApp main.go

# 设置交叉编译参数（Linux 系统 + amd64 架构）
GOOS=linux GOARCH=amd64 go build -o treeHoleApp main.go