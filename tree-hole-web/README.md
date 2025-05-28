# 树洞醇香版


## feature
- 拉去网页的记录，存在mysql里
- 支持接口查询，分页，安装字段排序，安装范围排序
- 支持搜索关键字
- 支持查看这个作者

## TODO
- 过滤讨厌的ID
- 添加统计信息，记录最多OO的用户，最多XX的用户，最多发表的用户


mvn clean package  -Dmaven.test.skip=true

nohup java -jar treehole-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod &