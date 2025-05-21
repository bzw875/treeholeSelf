# 第一阶段：构建可执行文件
FROM golang:1.20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制go.mod和go.sum文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制项目文件
COPY . .

# 构建可执行文件
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# 第二阶段：创建轻量级运行时镜像
FROM alpine:latest

# 安装必要的证书
RUN apk --no-cache add ca-certificates

# 设置工作目录
WORKDIR /root/

# 从构建阶段复制可执行文件
COPY --from=builder /app/main .
COPY --from=builder /app/configs/ ./configs/

# 暴露端口
EXPOSE 8080

# 运行应用程序
CMD ["./main"]    