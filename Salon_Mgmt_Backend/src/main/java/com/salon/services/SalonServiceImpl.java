package com.salon.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.dtos.CategoryWithServices;
import com.salon.dtos.GetAllSalon;
import com.salon.dtos.SalonDetailResponse;
import com.salon.dtos.ServiceResponse;
//import com.salon.dtos.SalonDetailsResponse;
import com.salon.entities.Salon;
import com.salon.repository.SalonRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class SalonServiceImpl implements SalonService {

    @Autowired
    private SalonRepository salonRepository;

    //get all salons
    @Override
    public Page<GetAllSalon> getAllSalons(String search,  String state, Pageable pageable) {

        Page<Salon> salons = salonRepository.searchApprovedSalons(
                normalize(search),
                normalize(state),
                pageable
        );

        return salons.map(this::convertToDTO);
    }

    private String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private GetAllSalon convertToDTO(Salon salon) {
        return GetAllSalon.builder()
                .salonId(salon.getSalonId())
                .salonName(salon.getSalonName())
                .address(salon.getAddress())
                .city(salon.getCity())
                .state(salon.getState())
                .pincode(salon.getPincode())
                .phone(salon.getPhone())
                .email(salon.getEmail())
                .logo(salon.getLogo())
                .galleryImages(
                        salon.getGalleryImages() != null
                                ? salon.getGalleryImages().replace("[", "").replace("]", "").replace("\"", "").split(",")
                                : new String[]{}
                )
                .openingTime(salon.getOpeningTime())
                .closingTime(salon.getClosingTime())
                .workingDays(salon.getWorkingDays()) // safe now — fetched eagerly
                .ratingAverage(salon.getRatingAverage())
                .totalReviews(salon.getTotalReviews())
                .build();
    }
    
    
    //get salon by id
    @Override
    @Transactional(readOnly = true)
    public SalonDetailResponse getSalonDetailsById(Long salonId) {

        Salon salon = salonRepository.findSalonWithCategories(salonId)
                .orElseThrow(() -> new EntityNotFoundException("Salon not found with id: " + salonId));
        System.out.println("Categories size = " + salon.getServiceCategories().size());

        List<CategoryWithServices> categoryDTOs =
                salon.getServiceCategories()
                     .stream()
                     .map(cat -> {
                         // Explicitly trigger lazy loading of services
                         cat.getServices().size(); // This triggers the lazy load
                         
                         List<ServiceResponse> serviceDTOs = (cat.getServices() != null) 
                                 ? cat.getServices()
                                     .stream()
                                     .map(service -> ServiceResponse.builder()
                                             .serviceId(service.getServiceId())
                                             .serviceName(service.getServiceName())
                                             .description(service.getDescription())
                                             .basePrice(service.getBasePrice())
                                             .durationMinutes(service.getDurationMinutes())
                                             .isAvailable(service.getIsAvailable())
                                             .serviceCapacity(service.getServiceCapacity())
                                             .build())
                                     .toList()
                                 : List.of(); // Return empty list if services is null
                         
                         return CategoryWithServices.builder()
                                 .categoryId(cat.getCategoryId())
                                 .categoryName(cat.getCategoryName())
                                 .description(cat.getDescription())
                                 .services(serviceDTOs)
                                 .build();
                     })
                     .toList();
        System.out.println("Categories size = " + categoryDTOs.size());

        return SalonDetailResponse.builder()
                .salonId(salon.getSalonId())
                .salonName(salon.getSalonName())
                .address(salon.getAddress())
                .city(salon.getCity())
                .state(salon.getState())
                .pincode(salon.getPincode())
                .phone(salon.getPhone())
                .email(salon.getEmail())
                .logo(salon.getLogo())
                .galleryImages(salon.getGalleryImages() != null
                        ? salon.getGalleryImages().replace("[", "").replace("]", "").replace("\"", "").split(",")
                        : new String[]{})
                .openingTime(salon.getOpeningTime())
                .closingTime(salon.getClosingTime())
                .workingDays(List.copyOf(salon.getWorkingDays()))
                .ratingAverage(salon.getRatingAverage())
                .totalReviews(salon.getTotalReviews())
                .categories(categoryDTOs)
                .build();
    }

    
    

    
}
