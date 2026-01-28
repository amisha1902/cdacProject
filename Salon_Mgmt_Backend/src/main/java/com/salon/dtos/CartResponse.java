package com.salon.dtos;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;
    private Integer totalQuantity;
//    private Long salonId;
}

