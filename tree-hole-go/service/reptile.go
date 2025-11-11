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
	req.Header.Add("cookie", `_ga=GA1.1.1897347386.1732862156; egg_login_nickname=%E8%BF%98%E5%BE%88%E4%B8%8D%E5%91%A2%E7%A7%AF%E6%9E%81; FCNEC=%5B%5B%22AKsRol_frq0fMvoXoRoLrUGsDaGCtKOFABE8poj_IATVgEdjsoNpFurDbOu97u8GISHiIHmDHEji2mWLGOyhg08Heb7ABaHjcAsLgGA86fyH2FKuiNCQ6ZVoZvsRk3dxyfVnY4OGcgFuMieRJmtm_XM1nCrrvWoTWg%3D%3D%22%5D%5D; egg_settings={\"gifAutoLoad\":false,\"treeholeDefaultAnonymous\":false,\"lastUpdated\":\"2025-04-24T03:57:21.021Z\"}; egg_login_uid=5177; egg_auth=MTc1MDQwNTkwOXxBajN6MWxvMWFXNEVOMGRqYjJyNnhPRnFRVFE1OERsbHZuQ1N1M2t0RnFhQ3RUNDJ1UHhtVW1aeWk4SG5MSkhofEe9hVgQ5FLE5zqk7QLhyuEQhGbZM6RG45EJkdlDGY2V; comment_author_01b0531fab6a989460dd1b231010b496=%E8%BF%98%E5%BE%88%E4%B8%8D%E5%91%A2%E7%A7%AF%E6%9E%81; comment_author_email_01b0531fab6a989460dd1b231010b496=; PHPSESSID=fvj21beku4g8cmophnbf8scl9d; _ga_ZDE403EQ65=GS2.1.s1762427405$o1455$g1$t1762427496$j46$l0$h0`)

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
