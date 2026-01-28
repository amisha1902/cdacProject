package com.salon.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.salon.Repository.SalonRepository;
import com.salon.Repository.ServiceRepository;
import com.salon.entities.Salon;
import com.salon.entities.Services;
import com.salon.entities.ServiceRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;
    private final SalonRepository salonRepository;

    @Override
    public Services createService(ServiceRequest request, Integer ownerId) {

        Salon salon = salonRepository.findById(request.getSalonId().longValue())
                .orElseThrow(() -> new RuntimeException("Salon not found"));

        if (!salon.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        Services service = new Services();
        service.setSalonId(request.getSalonId());
        service.setStaffId(request.getStaffId());
        service.setServiceName(request.getServiceName());
        service.setCategory(request.getCategory());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setIsAvailable(1); // tinyint true
        service.setImage(null);    // DB has column
        service.setCreatedAt(LocalDateTime.now());
        service.setUpdatedAt(LocalDateTime.now());

        return serviceRepository.save(service);

    }

    @Override
    public Services updateService(Integer serviceId, ServiceRequest request, Integer ownerId) {

        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Salon salon = salonRepository.findById(request.getSalonId().longValue())
                .orElseThrow(() -> new RuntimeException("Salon not found"));

        if (!salon.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        service.setServiceName(request.getServiceName());
        service.setCategory(request.getCategory());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setStaffId(request.getStaffId());
        service.setUpdatedAt(LocalDateTime.now());

        return serviceRepository.save(service);
    }
}
