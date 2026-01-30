package com.salon.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salon.entities.Staff;
@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

}
