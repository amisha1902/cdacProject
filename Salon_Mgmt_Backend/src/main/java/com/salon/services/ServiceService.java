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
                .map(sv -> ServiceResponse.builder()
                        .serviceId(sv.getServiceId())
                        .serviceName(sv.getServiceName())
                        .basePrice(sv.getBasePrice())
                        .durationMinutes(sv.getDurationMinutes())
                        .description(sv.getDescription())
                        .image(sv.getImage())
                        .isAvailable(sv.getIsAvailable())
                        .serviceCapacity(sv.getServiceCapacity())
                        .build())
                .toList();
    }
}
