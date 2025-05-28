package service

import (
	"fmt"
	"io"
	"net/http"
)

func Reptile(url string) (error, string) {
	// 创建一个新的请求
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return err, ""
	}

	// 设置请求头
	req.Header.Set("referer", "https://jandan.net/treehole")
	req.Header.Add("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36")

	// 创建客户端并发送请求
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return err, ""
	}
	defer resp.Body.Close()

	// 读取响应
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading body:", err)
		return err, ""
	}

	fmt.Println("Status Code:", resp.StatusCode)
	return nil, string(body)
}
