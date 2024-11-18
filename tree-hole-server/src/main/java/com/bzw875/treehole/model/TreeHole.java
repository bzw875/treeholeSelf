package com.bzw875.treehole.model;



import jakarta.persistence.*;
import java.util.Date;
import java.time.LocalDateTime;

@Entity
public class TreeHole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "author", length = 100, nullable = false)
    private String author = "";
    @Column(name = "context", length = 5000, nullable = false)
    private String context = "";
    @Column(name = "dataId", length = 100, nullable = false)
    private String dataId = "";
    @Column(name = "likeNum")
    private Integer likeNum = 0;
    @Column(name = "dislikeNum")
    private Integer dislikeNum = 0;
    @Column(name = "commentNum")
    private Integer commentNum = 0;
    @Column(name = "postDate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date postDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // 构造器、getter和setter方法
    public TreeHole() {}

    public TreeHole(String author, String context, String dataId, Integer likeNum, Integer dislikeNum, Integer commentNum, Date postDate) {
        this.author = author;
        this.context = context;
        this.dataId = dataId;
        this.likeNum = likeNum;
        this.dislikeNum = dislikeNum;
        this.commentNum = commentNum;
        this.postDate = postDate;
    }

    public Long getId() {
        return id;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public String getAuthor() { return author;}
    public String getContext() { return context;}
    public String getDataId() { return dataId;}
    public Integer getLikeNum() { return likeNum;}
    public Integer getDislikeNum() { return dislikeNum;}
    public Integer getCommentNum() { return commentNum;}
    public Date getPostDate() { return postDate;}

    public void setId(Long id) {this.id = id; }
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) {this.updatedAt = updatedAt; }
    public void setAuthor(String author) {this.author = author; }
    public void setContext(String context) {this.context = context; }
    public void setDataId(String dataId) {this.dataId = dataId; }
    public  void setLikeNum(Integer likeNum) {this.likeNum = likeNum; }
    public void setDislikeNum(Integer dislikeNum) {this.dislikeNum = dislikeNum; }
    public void setCommentNum(Integer commentNum) {this.commentNum = commentNum; }
    public void setPostDate(Date postDate) {this.postDate = postDate; }

}
