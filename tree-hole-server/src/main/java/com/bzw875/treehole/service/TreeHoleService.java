package com.bzw875.treehole.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.bzw875.treehole.model.TreeHole;
import com.bzw875.treehole.repository.TreeHoleRepository;

import java.util.List;


@Service
public class TreeHoleService {

    @Autowired
    private TreeHoleRepository treeHoleRepository;

    public TreeHole createTreeHole(TreeHole treeHole) {
        return treeHoleRepository.save(treeHole);
    }

    public Iterable<TreeHole> getAllTreeHoles() {
        return treeHoleRepository.findAll();
    }

    public Iterable<TreeHole> getPageableTreeHoles(Pageable pageable) {
        return treeHoleRepository.findAll(pageable);
    }

    public Iterable<TreeHole> findByLikeNumBetween(Integer minLikeNum, Integer maxLikeNum, Pageable pageable) {
        return treeHoleRepository.findByLikeNumBetween(minLikeNum, maxLikeNum, pageable);
    }

    public Iterable<TreeHole> getTreeHoldByLikeNumGreaterThan(Integer minLikeNum, Pageable pageable) {
        return treeHoleRepository.getTreeHoldByLikeNumGreaterThan(minLikeNum, pageable);
    }



    public Iterable<TreeHole> searchTreeHoles(String search) {
        return treeHoleRepository.searchByContextOrAuthor(search);
    }

    public Iterable<TreeHole> authorTreeHoles(String author) {
        return treeHoleRepository.findByAuthor(author);
    }

    public List<TreeHole> getTreeHoleByData_id(String data_id) {
        return treeHoleRepository.findByDataId(data_id);
    }

    public void deleteTreeHole(Long id) {
        treeHoleRepository.deleteById(id);
    }

    public TreeHole updateTreeHole(Long id, TreeHole treeHole) {
        return treeHoleRepository.save(treeHole);
    }
}
