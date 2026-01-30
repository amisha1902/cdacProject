package com.salon.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.Repository.SalonRepository;
import com.salon.Repository.ServiceRepository;
import com.salon.Repository.StaffRepository;
import com.salon.entities.Salon;
import com.salon.entities.ServiceRequest;
import com.salon.entities.Services;
import com.salon.entities.Staff;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;
    private final SalonRepository salonRepository;
    private final StaffRepository staffRepository;

    @Transactional
    @Override
    public Services createService(ServiceRequest request, Integer ownerId) {

        if (request.getSalonId() == null) {
            throw new RuntimeException("Salon ID is required");
        }

        Salon salon = salonRepository.findById(request.getSalonId().longValue())
                .orElseThrow(() -> new RuntimeException("Salon not found"));

        if (!salon.getOwner().getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Services service = new Services();
        service.setSalon(salon);
        service.setStaff(staff);
        service.setServiceName(request.getServiceName());
        service.setCategory(request.getCategory());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setCapacity(request.getCapacity());
        service.setIsAvailable(1);

        return serviceRepository.save(service);
    }

    @Transactional
    @Override
    public Services updateService(Integer serviceId, ServiceRequest request, Integer ownerId) {

        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Salon salon = service.getSalon();

        if (!salon.getOwner().getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        service.setServiceName(request.getServiceName());
        service.setCategory(request.getCategory());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setCapacity(request.getCapacity());

        return serviceRepository.save(service);
    }

}
