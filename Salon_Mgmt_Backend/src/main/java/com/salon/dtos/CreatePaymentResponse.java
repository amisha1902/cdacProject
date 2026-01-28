package com.salon.dtos;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreatePaymentResponse {

    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String key;
}
