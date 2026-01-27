package com.salon.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	boolean existsByEmail(String em);
	Optional<User> findByEmail(String email);
}
