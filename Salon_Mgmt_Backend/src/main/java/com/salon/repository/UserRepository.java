package com.salon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {

}
