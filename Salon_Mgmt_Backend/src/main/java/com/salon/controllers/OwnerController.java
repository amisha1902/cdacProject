package com.salon.controllers;

import com.salon.dtos.ApiResponse;
import com.salon.dtos.CreateSalonDTO;
import com.salon.dtos.DashboardStatsDTO;
import com.salon.dtos.OwnerBookingDTO;
import com.salon.dtos.ServiceCategoryDTO;
import com.salon.entities.Salon;
import com.salon.services.OwnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Authentication authentication) {
        Integer userId = Integer.parseInt(authentication.getName());
        return ResponseEntity.ok(ownerService.getDashboardStats(userId));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<OwnerBookingDTO>> getOwnerBookings(Authentication authentication) {
        Integer userId = Integer.parseInt(authentication.getName());
        return ResponseEntity.ok(ownerService.getOwnerBookings(userId));
    }

    // Debug endpoint to check authentication
    @GetMapping("/debug")
    public ResponseEntity<?> debug(Authentication authentication) {
        try {
            Integer userId = Integer.parseInt(authentication.getName());
            return ResponseEntity.ok(java.util.Map.of(
                "userId", userId,
                "isAuthenticated", true,
                "message", "Authentication working"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of(
                "error", e.getMessage(),
                "isAuthenticated", false
            ));
        }
    }

    @PostMapping("/salons")
    public ResponseEntity<Salon> createSalon(
            @Valid @RequestBody CreateSalonDTO dto,
            Authentication authentication) {
        Integer userId = Integer.parseInt(authentication.getName());
        Salon salon = ownerService.createSalon(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(salon);
    }

    @GetMapping("/salons")
    public ResponseEntity<List<Salon>> getOwnerSalons(Authentication authentication) {
        try {
            System.out.println("🔍 [GET /api/owner/salons] Authentication: " + authentication);
            System.out.println("🔍 [GET /api/owner/salons] Username (userId): " + authentication.getName());
            
            Integer userId = Integer.parseInt(authentication.getName());
            System.out.println("✅ [GET /api/owner/salons] Parsed userId: " + userId);
            
            List<Salon> salons = ownerService.getOwnerSalons(userId);
            System.out.println("✅ [GET /api/owner/salons] Found " + salons.size() + " salons");
            
            return ResponseEntity.ok(salons);
        } catch (Exception e) {
            System.err.println("❌ [GET /api/owner/salons] Error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/salons/{salonId}")
    public ResponseEntity<Salon> getSalonById(
            @PathVariable Long salonId,
            Authentication authentication) {
        Integer userId = Integer.parseInt(authentication.getName());
        return ResponseEntity.ok(ownerService.getSalonById(salonId, userId));
    }

    @PutMapping("/salons/{salonId}")
    public ResponseEntity<Salon> updateSalon(
            @PathVariable Long salonId,
            @Valid @RequestBody CreateSalonDTO dto,
            Authentication authentication) {
        try {
            System.out.println("🔍 [PUT /api/owner/salons/" + salonId + "] Update request received");
            System.out.println("🔍 [PUT] DTO: " + dto);
            
            Integer userId = Integer.parseInt(authentication.getName());
            System.out.println("✅ [PUT] userId: " + userId);
            
            Salon updated = ownerService.updateSalon(salonId, dto, userId);
            System.out.println("✅ [PUT] Salon updated successfully");
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("❌ [PUT /api/owner/salons/" + salonId + "] Error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/salons/{salonId}/logo")
    public ResponseEntity<ApiResponse> uploadLogo(
            @PathVariable Long salonId,
            @RequestParam("logo") MultipartFile file,
            Authentication authentication) {
        Integer userId = Integer.parseInt(authentication.getName());
        return ResponseEntity.ok(ownerService.uploadSalonLogo(salonId, file, userId));
    }

    @PostMapping("/salons/{salonId}/gallery")
    public ResponseEntity<ApiResponse> uploadGallery(
            @PathVariable Long salonId,
            @RequestParam("images") List<MultipartFile> files,
            Authentication authentication) {
        Integer userId = Integer.parseInt(authentication.getName());
        return ResponseEntity.ok(ownerService.uploadSalonGallery(salonId, files, userId));
    }

    @GetMapping("/salons/{salonId}/categories")
    public ResponseEntity<List<ServiceCategoryDTO>> getSalonCategories(
            @PathVariable Long salonId,
            Authentication authentication) {
        Integer userId = Integer.parseInt(authentication.getName());
        return ResponseEntity.ok(ownerService.getSalonCategories(salonId, userId));
    }

    @PostMapping("/salons/{salonId}/categories")
    public ResponseEntity<ServiceCategoryDTO> addCategory(
            @PathVariable Long salonId,
            @RequestBody ServiceCategoryDTO categoryDTO,
            Authentication authentication) {
        Integer userId = Integer.parseInt(authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ownerService.addCategoryToSalon(salonId, categoryDTO, userId));
    }
}
