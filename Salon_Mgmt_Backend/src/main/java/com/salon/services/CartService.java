package com.salon.services;

import com.salon.dtos.AddToCart;
import com.salon.dtos.CartItemResponse;
import com.salon.dtos.CartResponse;
import com.salon.dtos.UpdateCartRequest;

public interface CartService {
    CartResponse getCart(Integer userId);
    CartResponse addToCart(AddToCart dto, Integer userId);
    CartItemResponse updateCart(Integer itemId, Integer userId, UpdateCartRequest dto);
    CartResponse deleteItem(Integer itemId, Integer userId);
}
