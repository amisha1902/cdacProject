package com.salon.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.salon.Repository.CategoryRepository;
import com.salon.Repository.OwnerRepository;
import com.salon.entities.CategoryRequest;
import com.salon.entities.ServiceCategory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;
	private final OwnerRepository ownerRepository;
	
	@Override
	public ServiceCategory createCategory(CategoryRequest request, Integer ownerId) {
		
		ownerRepository.findById(ownerId)
		      .orElseThrow(()-> new RuntimeException("Owner not found"));
		
		ServiceCategory category = new ServiceCategory();
		
		category.setCategoryName(request.getCategoryName());
		category.setDescription(request.getDescription());
		category.setCreatedAt(LocalDateTime.now());
		category.setIsActive(true);
		
		return categoryRepository.save(category);
	}

	@Override
	public ServiceCategory updateCategory(Integer categoryId, CategoryRequest request, Integer ownerId) {
		
		ownerRepository.findById(ownerId)
		         .orElseThrow(()-> new RuntimeException("Owner not found"));
		
		ServiceCategory category = categoryRepository.findById(categoryId)
				      .orElseThrow(()-> new RuntimeException("Owner not found"));
		
		
		category.setCategoryName(request.getCategoryName());
		category.setDescription(request.getDescription());
		return categoryRepository.save(category);
	}

}
