package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProxyAgent(c *gin.Context) {
	// 读取请求体
	var reqBody map[string]interface{}
	if err := c.BindJSON(&reqBody); err != nil {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  "Invalid request body: " + err.Error(),
		})
		return
	}

	// 构造代理请求
	client := &http.Client{}
	proxyReq, err := http.NewRequest("POST", "https://ark.cn-beijing.volces.com/api/v3/chat/completions", nil)
	if err != nil {
		c.JSON(500, gin.H{
			"code": 500,
			"msg":  "Failed to create request: " + err.Error(),
		})
		return
	}

	// 设置请求体
	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		c.JSON(500, gin.H{
			"code": 500,
			"msg":  "Failed to marshal request body: " + err.Error(),
		})
		return
	}
	proxyReq.Body = io.NopCloser(bytes.NewReader(jsonBytes))
	proxyReq.Header.Set("Content-Type", "application/json")
	proxyReq.Header.Set("Authorization", "Bearer f29e2b54-b1e8-42ae-9155-080f22feb686")

	// 发送请求
	resp, err := client.Do(proxyReq)
	if err != nil {
		c.JSON(500, gin.H{
			"code": 500,
			"msg":  "Failed to send request: " + err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	// 读取响应
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(500, gin.H{
			"code": 500,
			"msg":  "Failed to read response: " + err.Error(),
		})
		return
	}

	// 返回响应
	c.Data(resp.StatusCode, "application/json", respBody)
}
