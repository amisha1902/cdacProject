package com.salon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.entities.Service;

public interface ServiceRepository extends JpaRepository<Service, Integer> {
/////get services by category
    @Query("""
    		SELECT s FROM Service s
    		WHERE s.category.categoryId = :categoryId
    		""")
    		List<Service> findByCategoryId(@Param("categoryId") Integer categoryId);
}
