package com.salon.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salon.customException.ApiException;
import com.salon.customException.ResourceNotFoundException;
import com.salon.dtos.ApiResponse;
import com.salon.dtos.CreateSalonDTO;
import com.salon.dtos.DashboardStatsDTO;
import com.salon.dtos.OwnerBookingDTO;
import com.salon.dtos.RecentBookingDTO;
import com.salon.dtos.TopSalonDTO;
import com.salon.dtos.ServiceCategoryDTO;
import com.salon.dtos.ServiceDTO;
import com.salon.entities.Booking;
import com.salon.entities.BookingService;
import com.salon.entities.Owner;
import com.salon.entities.Salon;
import com.salon.entities.ServiceCategory;
import com.salon.entities.Services;
import com.salon.entities.User;
import com.salon.repository.BookingRepository;
import com.salon.repository.OwnerRepository;
import com.salon.repository.SalonRepository;
import com.salon.repository.ServiceCategoryRepository;
import com.salon.repository.ServiceRepository;
import com.salon.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService {

    private final SalonRepository salonRepository;
    private final OwnerRepository ownerRepository;
    private final UserRepository userRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final SlotGenerationService slotGenerationService;
    private final CloudinaryService cloudinaryService;
    private static final String UPLOAD_DIR = "uploads/salon-images/";
    private static final String LOGO_DIR = "uploads/salon-logos/";

    @Override
    public DashboardStatsDTO getDashboardStats(Integer userId) {
        // Get owner
        Owner owner = ownerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ApiException("Owner profile not found"));

        // Get owner's salons
        List<Salon> salons = salonRepository.findByOwner(owner);
        
        // Count active services across all salons
        Long activeServices = 0L;
        for (Salon salon : salons) {
            List<ServiceCategory> categories = serviceCategoryRepository.findBySalonAndIsActiveTrue(salon);
            for (ServiceCategory category : categories) {
                activeServices += serviceRepository.countByCategory(category);
            }
        }

        // Get all bookings for owner's salons
        List<Booking> bookings = bookingRepository.findByOwnerWithDetails(owner);
        
        // Calculate total bookings and revenue
        long totalBookings = bookings.size();
        double totalRevenue = bookings.stream()
                .filter(b -> b.getStatus() == com.salon.entities.enums.BookingStatus.CONFIRMED 
                          || b.getStatus() == com.salon.entities.enums.BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalAmount().doubleValue())
                .sum();
        
        // Calculate average rating across all salons
        double averageRating = salons.stream()
                .filter(s -> s.getRatingAverage() != null)
                .mapToDouble(s -> s.getRatingAverage().doubleValue())
                .average()
                .orElse(0.0);

        // Get recent bookings (last 5)
        List<RecentBookingDTO> recentBookings = bookings.stream()
                .sorted((b1, b2) -> b2.getBookingDate().compareTo(b1.getBookingDate()))
                .limit(5)
                .map(booking -> {
                    // Get customer name
                    User customer = userRepository.findById(booking.getCustomerId()).orElse(null);
                    String customerName = customer != null 
                        ? customer.getFirstName() + " " + customer.getLastName() 
                        : "Unknown";
                    
                    // Get first service details
                    BookingService firstService = booking.getServices().isEmpty() 
                        ? null 
                        : booking.getServices().get(0);
                    
                    return RecentBookingDTO.builder()
                            .id(booking.getBookingId())
                            .customerName(customerName)
                            .salonName(booking.getSalon() != null ? booking.getSalon().getSalonName() : "Unknown")
                            .date(firstService != null ? firstService.getDate() : null)
                            .time(firstService != null ? firstService.getStartTime() : null)
                            .status(booking.getStatus())
                            .amount(booking.getTotalAmount())
                            .build();
                })
                .collect(java.util.stream.Collectors.toList());

        // Get top performing salons
        List<TopSalonDTO> topSalons = salons.stream()
                .map(salon -> {
                    // Count bookings for this salon
                    long salonBookings = bookings.stream()
                            .filter(b -> b.getSalon() != null && b.getSalon().getSalonId().equals(salon.getSalonId()))
                            .count();
                    
                    // Calculate revenue for this salon
                    double salonRevenue = bookings.stream()
                            .filter(b -> b.getSalon() != null 
                                      && b.getSalon().getSalonId().equals(salon.getSalonId())
                                      && (b.getStatus() == com.salon.entities.enums.BookingStatus.CONFIRMED 
                                         || b.getStatus() == com.salon.entities.enums.BookingStatus.COMPLETED))
                            .mapToDouble(b -> b.getTotalAmount().doubleValue())
                            .sum();
                    
                    return TopSalonDTO.builder()
                            .id(salon.getSalonId().intValue())
                            .name(salon.getSalonName())
                            .logo(salon.getLogo())
                            .ratingAverage(salon.getRatingAverage())
                            .totalBookings((int) salonBookings)
                            .totalRevenue(java.math.BigDecimal.valueOf(salonRevenue))
                            .build();
                })
                .sorted((s1, s2) -> s2.getTotalBookings().compareTo(s1.getTotalBookings()))
                .limit(3)
                .collect(java.util.stream.Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalSalons((long) salons.size())
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .averageRating(averageRating)
                .activeServices(activeServices)
                .recentBookings(recentBookings)
                .topSalons(topSalons)
                .build();
    }

    @Override
    public List<OwnerBookingDTO> getOwnerBookings(Integer userId) {
        // Get owner
        Owner owner = ownerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ApiException("Owner profile not found"));

        // Get all bookings for owner's salons
        List<Booking> bookings = bookingRepository.findByOwnerWithDetails(owner);
        
        List<OwnerBookingDTO> ownerBookings = new ArrayList<>();
        
        for (Booking booking : bookings) {
            // Get customer details
            User customer = userRepository.findById(booking.getCustomerId())
                    .orElse(null);
                    
            // Process each service in the booking
            for (BookingService bookingService : booking.getServices()) {
                OwnerBookingDTO dto = OwnerBookingDTO.builder()
                        .bookingId(booking.getBookingId())
                        .bookingDate(booking.getBookingDate())
                        .status(booking.getStatus())
                        .totalAmount(booking.getTotalAmount())
                        // Customer details
                        .customerId(booking.getCustomerId())
                        .customerFirstName(customer != null ? customer.getFirstName() : "Unknown")
                        .customerLastName(customer != null ? customer.getLastName() : "")
                        .customerEmail(customer != null ? customer.getEmail() : "Unknown")
                        .customerPhone(customer != null ? customer.getPhone() : "Unknown")
                        // Service details
                        .serviceId((long) bookingService.getService().getServiceId())
                        .serviceName(bookingService.getService().getServiceName())
                        .categoryName(bookingService.getService().getCategory().getCategoryName())
                        .serviceDate(bookingService.getDate())
                        .startTime(bookingService.getStartTime())
                        .endTime(bookingService.getEndTime())
                        .servicePrice(bookingService.getPrice())
                        .quantity(1) // Default quantity for salon services
                        .build();
                        
                ownerBookings.add(dto);
            }
        }
        
        return ownerBookings;
    }

    @Override
    public Salon createSalon(CreateSalonDTO dto, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find owner by user
        Owner owner = ownerRepository.findAllWithUser().stream()
                .filter(o -> o.getUser().getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Owner profile not found"));

        Salon salon = new Salon();
        salon.setSalonName(dto.getSalonName());
        salon.setAddress(dto.getAddress());
        salon.setCity(dto.getCity());
        salon.setState(dto.getState());
        salon.setPincode(dto.getPincode());
        salon.setPhone(dto.getPhone());
        salon.setEmail(dto.getEmail());
        salon.setOwner(owner);
        salon.setIsApproved(0); // Pending approval

        // Parse time strings
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        salon.setOpeningTime(LocalTime.parse(dto.getOpeningTime(), formatter));
        salon.setClosingTime(LocalTime.parse(dto.getClosingTime(), formatter));

        // Set working days
        if (dto.getWorkingDays() != null && !dto.getWorkingDays().isEmpty()) {
            salon.setWorkingDays(dto.getWorkingDays());
        }

        // Save salon first to get ID
        Salon savedSalon = salonRepository.save(salon);

        // Process categories and services if provided
        if (dto.getCategories() != null && !dto.getCategories().isEmpty()) {
            for (ServiceCategoryDTO categoryDTO : dto.getCategories()) {
                ServiceCategory category = new ServiceCategory();
                category.setCategoryName(categoryDTO.getCategoryName());
                category.setDescription(categoryDTO.getDescription());
                category.setIsActive(true);
                category.setSalon(savedSalon);
                
                ServiceCategory savedCategory = serviceCategoryRepository.save(category);

                // Process services for this category
                if (categoryDTO.getServices() != null && !categoryDTO.getServices().isEmpty()) {
                    for (ServiceDTO serviceDTO : categoryDTO.getServices()) {
                        Services service = new Services();
                        service.setServiceName(serviceDTO.getServiceName());
                        service.setDescription(serviceDTO.getDescription());
                        service.setBasePrice(serviceDTO.getBasePrice());
                        service.setDurationMinutes(serviceDTO.getDurationMinutes());
                        service.setServiceCapacity(serviceDTO.getServiceCapacity() != null ? serviceDTO.getServiceCapacity() : 5);
                        service.setIsAvailable(true);
                        service.setCategory(savedCategory);
                        service.setSalon(savedSalon);
                        
                        Services savedService = serviceRepository.save(service);
                        
                        // Automatically generate slots for the next 30 days for this new service
                        try {
                            LocalDate today = LocalDate.now();
                            LocalDate endDate = today.plusDays(30);
                            slotGenerationService.generateSlotsForDateRange(today, endDate);
                            System.out.println("✅ Generated slots for service: " + savedService.getServiceName());
                        } catch (Exception e) {
                            System.err.println("⚠️ Failed to generate slots for service: " + savedService.getServiceName() + ". Error: " + e.getMessage());
                            // Don't fail the whole operation if slot generation fails
                        }
                    }
                }
            }
        }

        return savedSalon;
    }

    @Override
    public List<Salon> getOwnerSalons(Integer userId) {
        System.out.println("🔍 [OwnerService] getOwnerSalons for userId: " + userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        System.out.println("✅ [OwnerService] User found: " + user.getEmail() + ", Role: " + user.getUserRole());

        List<Owner> allOwners = ownerRepository.findAllWithUser();
        System.out.println("🔍 [OwnerService] Total owners in database: " + allOwners.size());
        
        Owner owner = allOwners.stream()
                .filter(o -> o.getUser().getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> {
                    System.err.println("❌ [OwnerService] Owner not found for userId: " + userId);
                    System.err.println("Available owner userIds: " + 
                        allOwners.stream()
                            .map(o -> o.getUser().getUserId())
                            .toList());
                    return new ApiException("Owner profile not found. Please contact admin.");
                });

        System.out.println("✅ [OwnerService] Owner found: ownerId=" + owner.getOwnerId());
        
        List<Salon> salons = salonRepository.findAll().stream()
                .filter(s -> s.getOwner().getOwnerId().equals(owner.getOwnerId()))
                .toList();
        
        System.out.println("✅ [OwnerService] Found " + salons.size() + " salons for this owner");
        
        return salons;
    }

    @Override
    public Salon getSalonById(Long salonId, Integer userId) {
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found"));

        // Verify ownership
        if (!salon.getOwner().getUser().getUserId().equals(userId)) {
            throw new ApiException("You don't have permission to access this salon");
        }

        return salon;
    }

    @Override
    public Salon updateSalon(Long salonId, CreateSalonDTO dto, Integer userId) {
        System.out.println("🔍 [OwnerService] updateSalon - salonId: " + salonId + ", userId: " + userId);
        System.out.println("🔍 [OwnerService] DTO: " + dto);
        
        Salon salon = getSalonById(salonId, userId);
        System.out.println("✅ [OwnerService] Found salon: " + salon.getSalonName());

        salon.setSalonName(dto.getSalonName());
        salon.setAddress(dto.getAddress());
        salon.setCity(dto.getCity());
        salon.setState(dto.getState());
        salon.setPincode(dto.getPincode());
        salon.setPhone(dto.getPhone());
        salon.setEmail(dto.getEmail());

        // Parse time strings
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        try {
            salon.setOpeningTime(LocalTime.parse(dto.getOpeningTime(), formatter));
            salon.setClosingTime(LocalTime.parse(dto.getClosingTime(), formatter));
            System.out.println("✅ [OwnerService] Times parsed successfully");
        } catch (Exception e) {
            System.err.println("❌ [OwnerService] Time parsing error: " + e.getMessage());
            throw e;
        }

        if (dto.getWorkingDays() != null && !dto.getWorkingDays().isEmpty()) {
            salon.setWorkingDays(dto.getWorkingDays());
            System.out.println("✅ [OwnerService] Working days set: " + dto.getWorkingDays());
        }

        Salon updated = salonRepository.save(salon);
        System.out.println("✅ [OwnerService] Salon updated successfully");
        return updated;
    }

    @Override
    public ApiResponse uploadSalonLogo(Long salonId, MultipartFile file, Integer userId) {
        Salon salon = getSalonById(salonId, userId);

        if (file.isEmpty()) {
            throw new ApiException("Please select a file to upload");
        }

        try {
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file, "salon-logos");

            // Update salon logo URL
            salon.setLogo(imageUrl);
            salonRepository.save(salon);

            return new ApiResponse("Logo uploaded successfully", "SUCCESS");

        } catch (IOException e) {
            throw new ApiException("Failed to upload logo: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse uploadSalonGallery(Long salonId, List<MultipartFile> files, Integer userId) {
        Salon salon = getSalonById(salonId, userId);

        if (files == null || files.isEmpty()) {
            throw new ApiException("Please select at least one file to upload");
        }

        try {
            List<String> imageUrls = new ArrayList<>();

            // Upload each file to Cloudinary
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(file, "salon-gallery");
                    imageUrls.add(imageUrl);
                }
            }

            // Convert list to JSON and save
            ObjectMapper mapper = new ObjectMapper();
            String galleryJson = mapper.writeValueAsString(imageUrls);
            salon.setGalleryImages(galleryJson);
            salonRepository.save(salon);

            return new ApiResponse("Gallery images uploaded successfully", "SUCCESS");

        } catch (IOException e) {
            throw new ApiException("Failed to upload gallery images: " + e.getMessage());
        }
    }

    @Override
    public List<ServiceCategoryDTO> getSalonCategories(Long salonId, Integer userId) {
        Salon salon = getSalonById(salonId, userId);
        
        List<ServiceCategory> categories = serviceCategoryRepository.findAll().stream()
                .filter(c -> c.getSalon().getSalonId().equals(salonId))
                .toList();

        return categories.stream()
                .map(category -> {
                    ServiceCategoryDTO dto = new ServiceCategoryDTO();
                    dto.setCategoryId(category.getCategoryId());
                    dto.setCategoryName(category.getCategoryName());
                    dto.setDescription(category.getDescription());
                    dto.setIsActive(category.getIsActive());

                    // Get services for this category
                    List<Services> services = serviceRepository.findAll().stream()
                            .filter(s -> s.getCategory().getCategoryId().equals(category.getCategoryId()))
                            .toList();

                    List<ServiceDTO> serviceDTOs = services.stream()
                            .map(service -> {
                                ServiceDTO sDto = new ServiceDTO();
                                sDto.setServiceId(service.getServiceId());
                                sDto.setServiceName(service.getServiceName());
                                sDto.setDescription(service.getDescription());
                                sDto.setBasePrice(service.getBasePrice());
                                sDto.setDurationMinutes(service.getDurationMinutes());
                                sDto.setServiceCapacity(service.getServiceCapacity());
                                sDto.setIsAvailable(service.getIsAvailable());
                                return sDto;
                            })
                            .toList();

                    dto.setServices(serviceDTOs);
                    return dto;
                })
                .toList();
    }

    @Override
    public ServiceCategoryDTO addCategoryToSalon(Long salonId, ServiceCategoryDTO categoryDTO, Integer userId) {
        // Verify owner owns this salon
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found"));

        Owner owner = ownerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ApiException("Owner profile not found"));

        if (!salon.getOwner().getOwnerId().equals(owner.getOwnerId())) {
            throw new ApiException("You don't have permission to modify this salon");
        }

        // Create category
        ServiceCategory category = new ServiceCategory();
        category.setCategoryName(categoryDTO.getCategoryName());
        category.setDescription(categoryDTO.getDescription());
        category.setIsActive(true);
        category.setSalon(salon);

        ServiceCategory savedCategory = serviceCategoryRepository.save(category);

        // Add services if provided
        if (categoryDTO.getServices() != null && !categoryDTO.getServices().isEmpty()) {
            for (ServiceDTO serviceDTO : categoryDTO.getServices()) {
                Services service = new Services();
                service.setServiceName(serviceDTO.getServiceName());
                service.setDescription(serviceDTO.getDescription());
                service.setBasePrice(serviceDTO.getBasePrice());
                service.setDurationMinutes(serviceDTO.getDurationMinutes());
                service.setServiceCapacity(serviceDTO.getServiceCapacity() != null ? serviceDTO.getServiceCapacity() : 5);
                service.setIsAvailable(true);
                service.setCategory(savedCategory);
                service.setSalon(salon);

                Services savedService = serviceRepository.save(service);

                // Generate slots for the new service
                try {
                    LocalDate today = LocalDate.now();
                    LocalDate endDate = today.plusDays(30);
                    slotGenerationService.generateSlotsForDateRange(today, endDate);
                    System.out.println("✅ Generated slots for new service: " + savedService.getServiceName());
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to generate slots for service: " + savedService.getServiceName());
                }
            }
        }

        // Return the saved category with services
        ServiceCategoryDTO resultDTO = new ServiceCategoryDTO();
        resultDTO.setCategoryId(savedCategory.getCategoryId());
        resultDTO.setCategoryName(savedCategory.getCategoryName());
        resultDTO.setDescription(savedCategory.getDescription());
        resultDTO.setIsActive(savedCategory.getIsActive());

        // Get services
        List<Services> services = serviceRepository.findAll().stream()
                .filter(s -> s.getCategory().getCategoryId().equals(savedCategory.getCategoryId()))
                .toList();

        List<ServiceDTO> serviceDTOs = services.stream()
                .map(service -> {
                    ServiceDTO sDto = new ServiceDTO();
                    sDto.setServiceId(service.getServiceId());
                    sDto.setServiceName(service.getServiceName());
                    sDto.setDescription(service.getDescription());
                    sDto.setBasePrice(service.getBasePrice());
                    sDto.setDurationMinutes(service.getDurationMinutes());
                    sDto.setServiceCapacity(service.getServiceCapacity());
                    sDto.setIsAvailable(service.getIsAvailable());
                    return sDto;
                })
                .toList();

        resultDTO.setServices(serviceDTOs);
        return resultDTO;
    }
}
