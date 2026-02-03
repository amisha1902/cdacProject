package com.salon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salon.entities.ReviewReply;

@Repository
public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Integer> {
    List<ReviewReply> findByReview_ReviewIdOrderByCreatedAtAsc(Integer reviewId);
}
