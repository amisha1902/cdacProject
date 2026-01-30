package com.salon.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {

}
