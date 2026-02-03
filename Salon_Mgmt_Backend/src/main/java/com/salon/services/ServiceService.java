package com.salon.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.dtos.ServiceResponse;
import com.salon.repository.ServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<ServiceResponse> getServicesByCategory(Integer categoryId) {
        List<com.salon.entities.Services> services = serviceRepository.findByCategoryId(categoryId);

        // Map entities to DTO for API response
        return services.stream()
                .map(sv -> new ServiceResponse(sv.getServiceId(), sv.getServiceName(), sv.getBasePrice(), sv.getDurationMinutes(), sv.getDescription(), sv.getImage()))
                .toList();
    }
}
