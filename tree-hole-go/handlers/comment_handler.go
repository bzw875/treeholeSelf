package handlers

import (
	"net/http"
	"treehole/models"
	"treehole/service"

	"github.com/gin-gonic/gin"
)

func GetComments(c *gin.Context) {
	var query service.CommentQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Code: 400,
			Msg:  "Invalid parameters: " + err.Error(),
		})
		return
	}

	data, err := service.GetComments(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Code: 500,
			Msg:  "Server error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Code: 200,
		Msg:  "success",
		Data: data,
	})
}

func GetCommentsByAuthor(c *gin.Context) {
	author := c.Param("author")
	data, err := service.GetCommentsByAuthor(author)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Code: 500,
			Msg:  "Server error: " + err.Error(),
		})
	}
	c.JSON(http.StatusOK, models.Response{
		Code: 200,
		Msg:  "success",
		Data: data,
	})
}

func GetCommentsBySearch(c *gin.Context) {
	keyword := c.Query("q")
	data, err := service.GetCommentsBySearch(keyword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Code: 500,
			Msg:  "Server error: " + err.Error(),
		})
	}
	c.JSON(http.StatusOK, models.Response{
		Code: 200,
		Msg:  "success",
		Data: data,
	})
}

func GetCommentsStatic(c *gin.Context) {

}
