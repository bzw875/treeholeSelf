package com.bzw875.treehole.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bzw875.treehole.model.TreeHole;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;


public interface TreeHoleRepository extends JpaRepository<TreeHole, Long> {
    List<TreeHole> findByDataId(String dataId);

    List<TreeHole> findByAuthor(String author);

    Page<TreeHole> findByLikeNumBetween(Integer minLikeNum, Integer maxLikeNum, Pageable pageable);

    Page<TreeHole> getTreeHoldByLikeNumGreaterThan(Integer minLikeNum, Pageable pageable);

    @Query("SELECT u FROM TreeHole u WHERE u.author LIKE %:keyword% OR u.context LIKE %:keyword%")
    List<TreeHole> searchByContextOrAuthor(@Param("keyword") String keyword);
}