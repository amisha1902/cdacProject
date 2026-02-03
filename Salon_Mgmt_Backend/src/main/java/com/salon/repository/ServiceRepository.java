package com.salon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.entities.Services;

public interface ServiceRepository extends JpaRepository<Services, Integer> {
/////get services by category
    @Query("""
    		SELECT s FROM Services s
    		WHERE s.category.categoryId = :categoryId
    		""")
    		List<Services> findByCategoryId(@Param("categoryId") Integer categoryId);
    
    //for slot generation 
    @Query("""
    	    SELECT s FROM Services s
    	    WHERE s.isAvailable = true
    	""")
    	List<Services> findAllActiveServices();

}
