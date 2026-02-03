package com.salon.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.entities.User;
import com.salon.entities.UserRole;

public interface UserRepository extends JpaRepository<User, Integer> {
	boolean existsByEmail(String em);
	Optional<User> findByEmail(String email);
	
	
	// fetch all owners (approved + pending)
    List<User> findByUserRole(UserRole role);

    // fetch only pending owners
    List<User> findByUserRoleAndIsActiveFalse(UserRole role);

}
