package com.bzw875.treehole.controller;

import com.bzw875.treehole.model.TreeHole;
import com.bzw875.treehole.service.TreeHoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/treeHole")
public class TreeHoleController {

    private final TreeHoleService treeHoleService;

    @Autowired
    public TreeHoleController(TreeHoleService treeHoleService)
    {
        this.treeHoleService = treeHoleService;
    }

    @GetMapping
    public Iterable<TreeHole> getAllTreeHoles(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @RequestParam("field") String field,
            @RequestParam("sort") String sort,
            @RequestParam("likeRange") String likeRange
    ) {
        if (page == null) {
            return treeHoleService.getAllTreeHoles();
        }
        String sortField = field == null ? "postDate" : field;
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(sort.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sortField));
        if (likeRange == null || likeRange.equals("")) {
            return treeHoleService.getPageableTreeHoles(pageable);
        } else {
            String[] arr = likeRange.split("-");
            Integer minLikeNum = Integer.parseInt(arr[0]);
            String maxLikeNum = arr[1];
            if (maxLikeNum.equals("∞")) {
                return treeHoleService.getTreeHoldByLikeNumGreaterThan(minLikeNum, pageable);
            }
            return treeHoleService.findByLikeNumBetween(minLikeNum, Integer.parseInt(maxLikeNum), pageable);
        }
    }

    @GetMapping("/search")
    public Iterable<TreeHole> searchTreeHoles(@RequestParam("q") String search) {
        return treeHoleService.searchTreeHoles(search);
    }

    @GetMapping("/author/{author}")
    public Iterable<TreeHole> authorTreeHoles(@PathVariable String author) {
        return treeHoleService.authorTreeHoles(author);
    }


    @PostMapping
    public TreeHole createTreeHole(@RequestBody TreeHole treeHole) {
        return treeHoleService.createTreeHole(treeHole);
    }

    @PutMapping("/{id}")
    public TreeHole updateTreeHole(@PathVariable Long id, @RequestBody TreeHole treeHoleDetails) {
        return treeHoleService.updateTreeHole(id, treeHoleDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteTreeHole(@PathVariable Long id) {
        treeHoleService.deleteTreeHole(id);
    }
}
