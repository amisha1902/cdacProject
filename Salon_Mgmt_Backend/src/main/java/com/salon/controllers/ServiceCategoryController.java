package com.salon.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.dtos.ServiceResponse;
import com.salon.services.ServiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class ServiceCategoryController {

    private final ServiceService serviceService;

    
    ///get services for each category
    @GetMapping("/{categoryId}/services")
    public ResponseEntity<List<ServiceResponse>> getServicesByCategory(@PathVariable Integer categoryId) {
        List<ServiceResponse> services = serviceService.getServicesByCategory(categoryId);
        return ResponseEntity.ok(services);
    }
}
