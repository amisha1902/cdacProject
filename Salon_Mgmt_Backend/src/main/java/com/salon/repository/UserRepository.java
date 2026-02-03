package com.salon.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.entities.*;

public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByEmail(String em);
    Optional<User> findByEmail(String email);

    List<User> findByUserRole(UserRole role);
    List<User> findByUserRoleAndIsActiveFalse(UserRole role);

    // 🔥 ADMIN OPERATIONS (SAFE)
    @Modifying
    @Query("update User u set u.isActive = true where u.userId = :userId")
    int activateUser(@Param("userId") Integer userId);

    @Modifying
    @Query("update User u set u.isActive = false where u.userId = :userId")
    int deactivateUser(@Param("userId") Integer userId);
}
