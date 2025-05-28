package com.bzw875.treehole;


import com.bzw875.treehole.service.TreeHoleService;
import org.springframework.beans.factory.annotation.Autowired;


import com.bzw875.treehole.model.TreeHole;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import com.bzw875.treehole.config.Utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.time.Year;

import static java.lang.Integer.parseInt;


import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ScheduledTasks {

    @Autowired
    private TreeHoleService treeHoleService;

    private Integer page = 1;

    @Autowired
    private RestTemplate restTemplate;


    @Scheduled(fixedRate = 6543)
    public void runEvery10Seconds() {
        if (page > 2) {
            return;
        }
        String url = getUrl(page);
        this.save2Db(fetchLinks(url));
        System.out.println("fixedRate = 10000，page:" + page);
        page++;
    }

    public String getUrl(int page) {
        return "https://jandan.net/api/comment/post/102312?order=desc&page=" + page;
    }

    public void save2Db(List<TreeHole> ths) {
        for (TreeHole th : ths) {
            String dataId = th.getDataId();
            List<TreeHole> curs = treeHoleService.getTreeHoleByData_id(dataId);
            if (curs.size() == 0) {
                treeHoleService.createTreeHole(th);
                System.out.println("create:" + th.getAuthor());
            } else {
                TreeHole oh = curs.get(0);
                oh.setAuthor(th.getAuthor());
                oh.setContext(th.getContext());
                oh.setLikeNum(th.getLikeNum());
                oh.setDislikeNum(th.getDislikeNum());
                oh.setPostDate(th.getPostDate());
                oh.setCommentNum(th.getCommentNum());
                treeHoleService.updateTreeHole(curs.get(0).getId(), oh);
                System.out.println("update:" + th.getAuthor());
            }
        }
    }

    public List<TreeHole> fetchLinks(String url) {
        List<TreeHole> ths = new ArrayList<>();

            // 创建请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer your_access_token");
            headers.set("X-Custom-Header", "Custom Value");

            // 创建请求体（JSON）
            String requestBody = "{\"key\": \"value\", \"number\": 123}";

            // 创建HTTP请求实体
            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

            // 发送POST请求并获取响应
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );
            System.out.println(response);

//            for (Element li : linkElements) {
//                ths.add(this.createRecord(li));
//            }
        return ths;
    }

    public TreeHole createRecord(Element li) {
        String author = li.select(".author>strong").text();
        String context = li.select(".text>p").text();
        String dataId = li.select(".text .righttext").text();
        String likeNum = (li.select(".tucao-like-container span").text());
        String dislikeNum = (li.select(".tucao-unlike-container span").text());
        Integer commentNum = Utils.getIntFromString(li.select(".tucao-btn").text());
        Date postDate = Utils.getPostTime(li.select(".author small a").text().replace("@", ""));
        TreeHole th = new TreeHole(author, context, dataId, parseInt(likeNum), parseInt(dislikeNum), commentNum, postDate);
        return th;
    }
}