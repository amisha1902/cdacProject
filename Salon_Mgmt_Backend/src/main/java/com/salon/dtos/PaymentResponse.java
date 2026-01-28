package com.salon.dtos;

import java.math.BigDecimal;

import com.salon.entities.enums.PaymentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PaymentResponse {

    private Long paymentId;
    private Long bookingId;
    private BigDecimal amount;
    private PaymentStatus status;
}
