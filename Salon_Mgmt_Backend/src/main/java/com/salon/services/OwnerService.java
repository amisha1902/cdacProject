package com.salon.services;

import com.salon.dtos.ApiResponse;
import com.salon.dtos.CreateSalonDTO;
import com.salon.dtos.DashboardStatsDTO;
import com.salon.dtos.OwnerBookingDTO;
import com.salon.dtos.ServiceCategoryDTO;
import com.salon.entities.Salon;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface OwnerService {
    
    DashboardStatsDTO getDashboardStats(Integer userId);
    
    List<OwnerBookingDTO> getOwnerBookings(Integer userId);
    
    Salon createSalon(CreateSalonDTO dto, Integer userId);
    
    List<Salon> getOwnerSalons(Integer userId);
    
    Salon getSalonById(Long salonId, Integer userId);
    
    Salon updateSalon(Long salonId, CreateSalonDTO dto, Integer userId);
    
    ApiResponse uploadSalonLogo(Long salonId, MultipartFile file, Integer userId);
    
    ApiResponse uploadSalonGallery(Long salonId, List<MultipartFile> files, Integer userId);
    
    List<ServiceCategoryDTO> getSalonCategories(Long salonId, Integer userId);
    
    ServiceCategoryDTO addCategoryToSalon(Long salonId, ServiceCategoryDTO categoryDTO, Integer userId);
}
