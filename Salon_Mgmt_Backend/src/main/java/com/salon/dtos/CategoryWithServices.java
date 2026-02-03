package com.salon.dtos;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryWithServices {
    private Integer categoryId;
    private String categoryName;
    private String description;
    private List<ServiceResponse> services;
}
