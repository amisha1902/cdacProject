package com.salon.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.salon.dtos.AddToCart;
import com.salon.dtos.CartItemResponse;
import com.salon.dtos.CartResponse;
import com.salon.dtos.UpdateCartRequest;
import com.salon.services.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;
    @GetMapping("/getCart")

	public ResponseEntity<CartResponse> getCart(@RequestParam Integer userId){
		return ResponseEntity.ok(cartService.getCart(userId));
	}
    
    @PostMapping("/addToCart")
    public ResponseEntity<CartResponse> addToCart(
    		@RequestParam Integer userId,
    		@RequestBody AddToCart dto
    		)
    {
    	return ResponseEntity.ok(cartService.addToCart(dto, userId));
    }
    
    
    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartItemResponse> updateCart(@PathVariable Integer itemId, @RequestBody UpdateCartRequest requestdto, @RequestHeader("X-USER-ID") Integer userId){
    	
    	CartItemResponse response = cartService.updateCart(itemId, userId, requestdto);
    	return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<CartResponse> deleteItem(
            @PathVariable Integer itemId,
            @RequestHeader("X-USER-ID") Integer userId) {

        return ResponseEntity.ok(cartService.deleteItem(itemId, userId));
    }

}
