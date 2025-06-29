package handlers

import (
	"net/http"
	"treehole/models"
	"treehole/service"

	"github.com/gin-gonic/gin"
)

func QueryAishPost(c *gin.Context) {
	data, err := service.GetAishAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response3{
			Code: 500,
			Msg:  "Server error: " + err.Error(),
		})
	}
	c.JSON(http.StatusOK, models.Response3{
		Code: 200,
		Msg:  "success",
		Data: data.Data,
	})
}
