package handlers

import (
	"net/http"
	"treehole/models"
	"treehole/service"

	"github.com/gin-gonic/gin"
)

// GetUserStatistics 获取用户统计数据
func GetUserStatistics(c *gin.Context) {
	data, err := service.GetUserStatistics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response2{
			Code: 500,
			Msg:  "Server error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.Response2{
		Code: 200,
		Msg:  "success",
		Data: data.Data,
	})
}
