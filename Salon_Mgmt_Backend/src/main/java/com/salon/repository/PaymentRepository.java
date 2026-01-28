package com.salon.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}
