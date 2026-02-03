package com.salon.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategoryDTO {
    private Integer categoryId;
    private String categoryName;
    private String description;
    private Boolean isActive = true;
    private List<ServiceDTO> services = new ArrayList<>();
}
