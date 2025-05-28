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
    private Integer integer;


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
        try {
            RestTemplate restTemplate = new RestTemplate();

            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Referer", "https://jandan.net/treehole");
            headers.set("Cookie", "_ga=GA1.1.551619986.1747749730; __gads=ID=eb3ff71e1d41b81a:T=1747749729:RT=1747749729:S=ALNI_MaOhYFQ_DmVRxmETtswav4EKjKa5A; __gpi=UID=000010c9301b9b31:T=1747749729:RT=1747749729:S=ALNI_MYr0_X10yulYbxW4EHIyYYE6FS-Pw; __eoi=ID=315ab227e3e627f7:T=1747749729:RT=1747749729:S=AA-Afja8tWo4EGlG3Gprm-ZhUWCe; PHPSESSID=hntvqv0srd6kgbhc7t0njv6l4g; egg_data=MTc0Nzc0OTgzOHxKQktTSzVqUXItSVZ5Z1pWamt6YlJmbGlwVzg2Rm5pQUlxcEFFM3JLSHZhaFhTSnNNam1tUnpmbGMzS00wcWFNeUE4PXzIhYKlipKRnQsueS3IykKVCiWR8lmNnQX8_7fcnEByjQ==; egg_auth=MTc0Nzc0OTg0OHx0V2lfODZUQUczcHlpWndNX2RMZzZndnVjejFXazJXREJubmxvdGJYclRCWmdwVnd0TG5oN2ZSOWhYLUNma3hOfI1iCY0rbB4n9bMs3YGHFStEHxdd3aPQVRNSEld2Vclc; egg_login_uid=5177; egg_login_nickname=%E8%BF%98%E5%BE%88%E4%B8%8D%E5%91%A2%E7%A7%AF%E6%9E%81; _ga_ZDE403EQ65=GS2.1.s1747749729$o1$g1$t1747749853$j32$l0$h0");
            headers.set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36");

            // 发送 POST 请求
            ResponseEntity<String> response = restTemplate.getForEntity(
                    url,
                    String.class
            );

            // 打印响应 JSON
            System.out.println("Response JSON: " + response.getBody());
//            for (Element li : linkElements) {
//                ths.add(this.createRecord(li));
//            }
        } catch (Exception e) {
            e.printStackTrace();
        }
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