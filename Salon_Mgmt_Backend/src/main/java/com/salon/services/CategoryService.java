package com.salon.services;

import com.salon.entities.ServiceCategory;
import com.salon.entities.CategoryRequest;
public interface CategoryService {
  ServiceCategory createCategory(CategoryRequest request,Integer ownerId);
  ServiceCategory updateCategory(Integer categoryId, CategoryRequest request,Integer ownerId);
}
