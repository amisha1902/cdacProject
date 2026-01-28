package com.salon.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.entities.Cart;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    //========= Get cart by userId with items and services =======//
    @Query("""
        SELECT c FROM Cart c
        LEFT JOIN FETCH c.items ci
        LEFT JOIN FETCH ci.service
        WHERE c.userId = :userId
    """)
    Optional<Cart> findCartWithItems(@Param("userId") Integer userId);

    //========= Get cart by cartId with items and services =======//
    @Query("""
        SELECT c FROM Cart c
        LEFT JOIN FETCH c.items ci
        LEFT JOIN FETCH ci.service
        WHERE c.cartId = :cartId
    """)
    Optional<Cart> findCartWithItemsByCartId(@Param("cartId") Long long1);
}
