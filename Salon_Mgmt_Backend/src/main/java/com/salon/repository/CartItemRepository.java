package com.salon.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    Optional<CartItem> findByCartItemIdAndCart_UserId(Integer cartItemId, Integer userId);


}
 