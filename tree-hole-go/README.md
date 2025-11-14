# TreeHole Go 项目

一个基于 Go 语言和 Gin 框架开发的树洞应用，提供评论管理、用户认证、数据爬取等功能。

## 技术栈

- **语言**: Go 1.21+
- **Web框架**: Gin
- **ORM**: GORM
- **数据库**: MySQL
- **认证**: Token-based (Cookie)

## 项目结构

```
tree-hole-go/
├── cmd/                    # 命令行工具
├── config/                 # 配置文件
│   └── database.go        # 数据库配置
├── database/              # 数据库连接
│   └── mysql.go          # MySQL 初始化
├── handlers/              # 请求处理器
│   ├── auth_handler.go   # 认证相关
│   ├── comment_handler.go # 评论相关
│   ├── aish_handler.go   # AISH 相关
│   ├── proxy_agent.go    # 代理 Agent
│   └── statistics_handler.go # 统计相关
├── models/                # 数据模型
│   ├── user.go           # 用户模型
│   ├── comment.go        # 评论模型
│   ├── aish.go           # AISH 模型
│   └── statistics.go     # 统计模型
├── routes/                # 路由配置
│   └── routes.go         # 路由设置
├── service/               # 业务逻辑层
│   ├── auth_service.go   # 认证服务
│   ├── comment_service.go # 评论服务
│   ├── aish_service.go   # AISH 服务
│   ├── statistics_service.go # 统计服务
│   ├── batch.go          # 批量处理
│   └── reptile.go        # 爬虫服务
├── main.go               # 应用入口
├── go.mod                # Go 模块定义
└── README.md             # 项目说明
```

## 功能特性

- ✅ 用户认证（登录/登出）
- ✅ 评论管理（分页、排序、搜索）
- ✅ 按作者查询评论
- ✅ 关键词搜索
- ✅ 用户统计
- ✅ 数据爬取（从煎蛋网）
- ✅ AISH 帖子查询
- ✅ 代理 Agent（豆包）

## 环境配置

### 开发环境

默认使用开发环境配置，数据库密码硬编码在 `config/database.go` 中。

### 生产环境

设置以下环境变量：

```bash
export DB_PASSWORD=your_database_password
export GO_ENV=production
```

## 数据库配置

默认配置：
- **Host**: localhost
- **Port**: 3306
- **User**: root
- **Database**: jandan

生产环境通过 `DB_PASSWORD` 环境变量设置数据库密码。

## 运行项目

### 本地开发

```bash
# 安装依赖
go mod download

# 运行项目
go run main.go
```

服务将在 `http://localhost:8000` 启动。

### 打包部署

```bash
# 本地打包
go build -o treeHoleApp main.go

# 交叉编译（Linux 系统 + amd64 架构）
GOOS=linux GOARCH=amd64 go build -o treeHoleApp main.go
```

## API 接口文档

### 认证相关

#### 1. 用户登录

**接口地址**: `POST /api/auth/login`

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**响应示例** (成功):
```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "user_id": 1,
    "username": "your_username"
  }
}
```

**响应示例** (失败):
```json
{
  "code": 401,
  "msg": "用户名或密码错误"
}
```

**说明**: 
- 登录成功后会设置 Cookie `token`，有效期 7 天
- Token 存储在服务端内存中，用于后续接口认证

---

#### 2. 用户登出

**接口地址**: `POST /api/auth/logout`

**请求头**: 
```
Cookie: token=your_token
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "退出成功"
}
```

**说明**: 清除登录 Cookie

---

### 树洞相关（需要认证）

所有树洞相关接口都需要在请求头中携带 Cookie 中的 `token`。

#### 3. 获取评论列表

**接口地址**: `GET /api/treehole`

**请求头**:
```
Cookie: token=your_token
```

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | int | 否 | 0 | 页码（从0开始） |
| size | int | 是 | 10 | 每页数量（1-100） |
| field | string | 否 | date_gmt | 排序字段 |
| sort | string | 否 | DESC | 排序方向（ASC/DESC） |
| likeRange | string | 否 | - | 点赞范围，格式：`min-max` 或 `min-∞` |

**请求示例**:
```
GET /api/treehole?page=0&size=20&field=date_gmt&sort=DESC&likeRange=101-200
```

**响应示例** (成功):
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 1000,
    "list": [
      {
        "id": 1,
        "post_id": 102312,
        "author": "用户名",
        "author_type": 1,
        "date_gmt": "2024-01-01T00:00:00Z",
        "user_id": 123,
        "content": "评论内容",
        "vote_positive": 150,
        "vote_negative": 10,
        "sub_comment_count": 5,
        "images": null,
        "ip_location": "北京",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**响应示例** (失败):
```json
{
  "code": 401,
  "msg": "未提供认证 token"
}
```

---

#### 4. 按作者查询评论

**接口地址**: `GET /api/treehole/author/:author`

**请求头**:
```
Cookie: token=your_token
```

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| author | string | 作者用户名 |

**请求示例**:
```
GET /api/treehole/author/张三
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 50,
    "list": [
      {
        "id": 1,
        "post_id": 102312,
        "author": "张三",
        "content": "评论内容",
        ...
      }
    ]
  }
}
```

---

#### 5. 关键词搜索

**接口地址**: `GET /api/treehole/search`

**请求头**:
```
Cookie: token=your_token
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |

**请求示例**:
```
GET /api/treehole/search?q=关键词
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 25,
    "list": [
      {
        "id": 1,
        "content": "包含关键词的评论内容",
        ...
      }
    ]
  }
}
```

**说明**: 在评论内容中搜索包含关键词的记录

---

#### 6. 用户统计

**接口地址**: `GET /api/treehole/static`

**请求头**:
```
Cookie: token=your_token
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 10,
    "list": [
      {
        "author": "用户名",
        "total_likes": 5000,
        "total_dislikes": 200,
        "comments_received": 300,
        "articles_posted": 50
      }
    ]
  }
}
```

**说明**: 
- 返回满足以下任一条件的用户统计：
  - 总点赞数 > 1000
  - 总点踩数 > 1000
  - 收到的评论数 > 1000
- 按总点赞数降序排列

---

### AISH 相关（需要认证）

#### 7. 查询 AISH 帖子

**接口地址**: `GET /api/aish/posts`

**请求头**:
```
Cookie: token=your_token
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "title": "帖子标题",
        "articleUrl": "https://example.com/article/123",
        "articleId": "123",
        "area": "地区",
        "isNewUserPost": false,
        "author": "作者",
        "publishTime": "2024-01-01 00:00:00",
        "replyCount": 10,
        "readCount": 1000,
        "lastReplier": "最后回复者",
        "lastReplyTime": "2024-01-01 12:00:00"
      }
    ]
  }
}
```

---

### Agent 相关（需要认证）

#### 8. 代理豆包 Agent

**接口地址**: `POST /api/agent/doubao`

**请求头**:
```
Content-Type: application/json
Cookie: token=your_token
```

**请求体**:
```json
{
  "model": "ep-20241208123456-abcde",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**响应示例**:
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "ep-20241208123456-abcde",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！有什么可以帮助你的吗？"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

**说明**: 
- 代理转发请求到豆包 API (`https://ark.cn-beijing.volces.com/api/v3/chat/completions`)
- 请求体格式遵循 OpenAI 兼容的 API 格式
- 响应直接返回豆包 API 的原始响应

---

## 统一响应格式

### 成功响应
```json
{
  "code": 200,
  "msg": "success",
  "data": { ... }
}
```

### 错误响应
```json
{
  "code": 400/401/500,
  "msg": "错误信息"
}
```

**状态码说明**:
- `200`: 成功
- `400`: 请求参数错误
- `401`: 未认证或认证失败
- `500`: 服务器内部错误

## 静态资源

项目支持静态资源服务：
- 静态文件路径：`/assets` -> `./static/assets`
- 前端页面：`./static/index.html`

## 注意事项

1. 生产环境必须设置 `DB_PASSWORD` 环境变量
2. Token 存储使用内存映射，生产环境建议使用 Redis
3. 数据库会自动迁移 `Comment` 和 `User` 表结构
4. 启动时会执行 `Batch()` 函数进行数据爬取

## 许可证

MIT License