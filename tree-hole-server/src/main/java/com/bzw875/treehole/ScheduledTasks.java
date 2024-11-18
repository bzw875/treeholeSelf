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


import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    @Autowired
    private TreeHoleService treeHoleService;

    private Integer page = 64;


    @Scheduled(fixedRate = 7654)
    public void runEvery10Seconds() {
        if (page > 63) {
            return;
        }
        String url = getUrl(page);
        this.save2Db(fetchLinks(url));
        System.out.println("fixedRate = 10000，page:" + page);
        page++;
    }

    public String getUrl(int page) {
        Date d = new Date();
        String str = Year.now() + "" + (d.getMonth() + 1) + "" + d.getDate() + "-" + page;
        String baseStr = Base64.getEncoder().encodeToString(str.getBytes());
        System.out.println(str + " " + baseStr);
        return "https://jandan.net/treehole/" + baseStr;
    }

    public void save2Db(List<TreeHole> ths) {
        for (TreeHole th : ths) {
            String dataId = th.getDataId();
            List<TreeHole> curs = treeHoleService.getTreeHoleByData_id(dataId);
            System.out.println(dataId + "： size:" + curs.size());
            if (curs.size() == 0) {
                treeHoleService.createTreeHole(th);
            } else {
                TreeHole oh = curs.get(0);
                oh.setAuthor(th.getAuthor());
                oh.setContext(th.getContext());
                oh.setLikeNum(th.getLikeNum());
                oh.setDislikeNum(th.getDislikeNum());
                oh.setPostDate(th.getPostDate());
                oh.setCommentNum(th.getCommentNum());
                treeHoleService.updateTreeHole(curs.get(0).getId(), oh);
            }
        }
    }

    public List<TreeHole> fetchLinks(String url) {
        List<TreeHole> ths = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(url).get();
//            String filePath = "/Users/mac/workspace/java/treehole2/00.html";
//            String html = new String(Files.readAllBytes(Paths.get(filePath)));
//            Document doc = Jsoup.parse(html);

            // 选择所有链接
            Elements linkElements = doc.select(".commentlist>li");
            for (Element li : linkElements) {
                ths.add(this.createRecord(li));
            }
        } catch (IOException e) {
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