# 项目名称
PROJECT_NAME := treehole

# 构建目标目录
BUILD_DIR := ./build

# 可执行文件名称
BINARY_NAME := $(PROJECT_NAME)

# 默认目标
all: build

# 构建项目
build:
    @echo "开始构建项目..."
    mkdir -p $(BUILD_DIR)
    go build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server

# 运行项目
run: build
    @echo "开始运行项目..."
    $(BUILD_DIR)/$(BINARY_NAME)

# 测试项目
test:
    @echo "运行单元测试..."
    go test -v -cover ./...

# 代码格式化
fmt:
    @echo "格式化代码..."
    go fmt ./...

# 代码检查
lint:
    @echo "检查代码风格..."
    golangci-lint run

# 清理构建结果
clean:
    @echo "清理构建结果..."
    rm -rf $(BUILD_DIR)

# 数据库初始化
db-init:
    @echo "初始化数据库..."
    ./scripts/setup_db.sh

# 帮助信息
help:
    @echo "可用命令:"
    @echo "  make build   - 构建项目"
    @echo "  make run     - 运行项目"
    @echo "  make test    - 运行单元测试"
    @echo "  make fmt     - 格式化代码"
    @echo "  make lint    - 检查代码风格"
    @echo "  make clean   - 清理构建结果"
    @echo "  make db-init - 初始化数据库"
    @echo "  make help    - 显示帮助信息"

.PHONY: all build run test fmt lint clean db-init help    