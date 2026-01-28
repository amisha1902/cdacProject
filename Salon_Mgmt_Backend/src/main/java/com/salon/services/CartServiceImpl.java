package com.salon.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.dtos.AddToCart;
import com.salon.dtos.CartItemResponse;
import com.salon.dtos.CartResponse;
import com.salon.dtos.UpdateCartRequest;
import com.salon.entities.*;
import com.salon.exceptions.ResourceNotFoundException;
import com.salon.repository.CartItemRepository;
import com.salon.repository.CartRepository;
import com.salon.repository.ServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

	@Autowired
	private final CartRepository cartRepository;
	
	@Autowired
	private ServiceRepository serviceRepository;
	
	@Autowired
	private CartItemRepository cartItemRepo;
	//====Get Cart  ===//
	@Transactional(readOnly = true)
	public CartResponse getCart(Integer userId) {
		// TODO Auto-generated method stub
		
		Optional<Cart> optionalCart = cartRepository.findCartWithItems(userId);
		
		if(optionalCart.isEmpty()) {
			return new CartResponse(null, List.of(), BigDecimal.ZERO, 0);
		}
		
		Cart cart = optionalCart.get();
		List<CartItemResponse> items = cart.getItems().stream().map(item -> {
			CartItemResponse dto = new CartItemResponse();
			dto.setItemId(item.getCartItemId());
			dto.setServiceId(item.getService().getServiceId());
			dto.setServiceName(item.getService().getServiceName());
			dto.setPrice(item.getService().getBasePrice());
            dto.setQuantity(item.getQuantity());
            dto.setDate(item.getDate());
            dto.setTime(item.getTime());
            return dto;
        }).toList();
		
		BigDecimal totalAmount = items.stream()
			    .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
			    .reduce(BigDecimal.ZERO, BigDecimal::add);

		
		int totalQuantity = items.stream()
				.mapToInt(CartItemResponse::getQuantity)
				.sum();
		return new CartResponse(
				cart.getCartId(),
				items,
				totalAmount,
				totalQuantity
				);
	}
	
	//====Add Service To Cart 
	@Transactional
	public CartResponse addToCart(AddToCart dto, Integer userId) {
		// TODO Auto-generated method stub
		
		//check if service exists
		com.salon.entities.Service service  = serviceRepository.findById(dto.getServiceId())
				.orElseThrow(()-> new RuntimeException("service not found"));
		
		//get or creagte cart
		Cart cart = cartRepository.findCartWithItems(userId)
				.orElseGet(()->{
					Cart newCart = new Cart();
					newCart.setUserId(userId);
					return cartRepository.save(newCart);
				});
		
		
		//check if service with give date and time is duplicated or already present
		Optional<CartItem> existingItem = cart.getItems().stream()
				.filter(i -> i.getService().getServiceId().equals(dto.getServiceId())
				&& i.getDate().equals(dto.getDate())
				&& i.getTime().equals(dto.getTime()))
				.findFirst();
		
		CartItem cartItem;
		if(existingItem.isPresent()) {
			cartItem = existingItem.get();
			cartItem.setQuantity(cartItem.getQuantity() + dto.getQuantity() );
		}
		else {
			cartItem = new CartItem();
			cartItem.setCart(cart);
			cartItem.setService(service);
			cartItem.setDate(dto.getDate());
			cartItem.setTime(dto.getTime());
			cartItem.setQuantity(dto.getQuantity());
			cart.getItems().add(cartItem);		
			}
	
    cartRepository.save(cart);
    
    List<CartItemResponse> items = cart.getItems().stream()
    		.map(item -> {
    			CartItemResponse ci = new CartItemResponse();
    			ci.setItemId(item.getCartItemId());
    			ci.setServiceId(item.getService().getServiceId());
    			ci.setServiceName(item.getService().getServiceName());
    			ci.setDate(item.getDate());
    			ci.setTime(item.getTime());
                ci.setQuantity(item.getQuantity());
                ci.setPrice(item.getService().getBasePrice());
                return ci;
            }).toList();
    
    int totalQuantity = items.stream().mapToInt(CartItemResponse::getQuantity).sum();
    BigDecimal totalAmount = items.stream()
    	    .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
    	    .reduce(BigDecimal.ZERO, BigDecimal::add);
    
    
    CartResponse response = new CartResponse();
    response.setCartId(cart.getCartId());
    response.setItems(items);
    response.setTotalAmount(totalAmount);
response.setTotalQuantity(totalQuantity);
return response;
	}

	
	//Update cart
	@Transactional
	public CartItemResponse updateCart(Integer itemId, Integer userId, UpdateCartRequest requestdto) {
		// TODO Auto-generated method stub
		
		CartItem item  = cartItemRepo.findById(itemId)
				.orElseThrow(()-> new ResourceNotFoundException("Cart not found"));
		
		if(userId != null && !item.getCart().getUserId().equals(userId)) {
			throw new IllegalArgumentException("You cant update this cart");
		}
		
		if(requestdto.getQuantity() != null && requestdto.getQuantity() <= 0) {
			throw new IllegalArgumentException("Quantity must be greater than 0");
		}
		
		if(requestdto.getQuantity() != null) {
			item.setQuantity(requestdto.getQuantity());
		}
		
		if(requestdto.getDate() != null) {
			item.setDate(requestdto.getDate());
		}
		if(requestdto.getTime() != null) {
			item.setTime(requestdto.getTime());
		}
		
		CartItem updatedItem = cartItemRepo.save(item);
		
		CartItemResponse response = new CartItemResponse();
		response.setItemId(updatedItem.getCartItemId());
		response.setServiceId(updatedItem.getService().getServiceId());
		response.setServiceName(updatedItem.getService().getServiceName());
		response.setPrice(item.getService().getBasePrice());
        response.setQuantity(item.getQuantity());
        response.setDate(item.getDate());
        response.setTime(item.getTime());
        
        return response;
	}

	
	//Delete cart item
	@Transactional
	public CartResponse deleteItem(Integer itemId, Integer userId) {

	    CartItem item = cartItemRepo.findByCartItemIdAndCart_UserId(itemId, userId)
	            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

	    cartItemRepo.delete(item);
	    cartItemRepo.flush();

	    Cart cart = cartRepository.findCartWithItems(userId)
	            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

	    return mapToResponse(cart);
	}

	private CartResponse mapToResponse(Cart cart) {
	    List<CartItemResponse> items = cart.getItems().stream()
	            .map(this::mapToItemResponse)
	            .toList();

	    BigDecimal totalAmount = items.stream()
	    	    .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
	    	    .reduce(BigDecimal.ZERO, BigDecimal::add);

	    int totalQuantity = items.stream()
	            .mapToInt(CartItemResponse::getQuantity)
	            .sum();

	    return new CartResponse(
	            cart.getCartId(),
	            items,
	            totalAmount,
	            totalQuantity
	    );
	}

	private CartItemResponse mapToItemResponse(CartItem item) {
	    CartItemResponse dto = new CartItemResponse();
	    dto.setItemId(item.getCartItemId());
	    dto.setServiceId(item.getService().getServiceId());
	    dto.setServiceName(item.getService().getServiceName());
	    dto.setPrice(item.getService().getBasePrice());
	    dto.setQuantity(item.getQuantity());
	    dto.setDate(item.getDate());
	    dto.setTime(item.getTime());
	    return dto;
	}

}
