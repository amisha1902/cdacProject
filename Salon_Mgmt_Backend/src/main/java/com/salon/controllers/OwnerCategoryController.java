package com.salon.controllers;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.entities.CategoryRequest;
import com.salon.entities.ServiceCategory;
import com.salon.services.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/owners/categories")
@RequiredArgsConstructor
public class OwnerCategoryController {

	private final CategoryService categoryService;
	
	@PostMapping
	public ServiceCategory createCategory(
			@RequestBody CategoryRequest request,
			@RequestHeader("Owner-Id") Integer ownerId
			) {
		
		return categoryService.createCategory(request, ownerId);
	}
	
	@PutMapping("/{categoryId}")
	public ServiceCategory updateCategory(
			@PathVariable Integer categoryId,
			@RequestBody CategoryRequest request,
			@RequestHeader("Owner-Id") Integer ownerId
			) {
		return categoryService.updateCategory(categoryId, request, ownerId);
	}
	
}
