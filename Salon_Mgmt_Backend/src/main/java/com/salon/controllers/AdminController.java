package com.salon.controllers;

import java.util.List;

import com.salon.entities.Owner;
import com.salon.entities.User;
import com.salon.entities.UserRole;
import com.salon.repository.OwnerRepository;
import com.salon.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.salon.dtos.CustomerAdminDTO;
import com.salon.dtos.OwnerAdminDTO;
import com.salon.services.AdminService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;



    /* ================= USER ROLE ================= */

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Integer userId,
            @RequestParam String role
    ) {
        return ResponseEntity.ok(adminService.changeUserRole(userId, role));
    }
    
    //===============================
 // 🔹 Fetch pending owners
    @GetMapping("/owners/pending")
    public ResponseEntity<List<OwnerAdminDTO>> getPendingOwners() {
        return ResponseEntity.ok(adminService.getPendingOwners());
    }

    // 🔹 Approve owner
    @PutMapping("/owners/{userId}/approve")
    public ResponseEntity<String> approveOwner(@PathVariable Integer userId) {
        adminService.approveOwner(userId);
        return ResponseEntity.ok("Owner approved successfully");
    }

    // 🔹 Reject owner
    @PutMapping("/owners/{userId}/reject")
    public ResponseEntity<String> rejectOwner(@PathVariable Integer userId) {
        adminService.rejectOwner(userId);
        return ResponseEntity.ok("Owner rejected successfully");
    }
    
    @GetMapping("/getAllCustomers")
    public ResponseEntity<List<CustomerAdminDTO>> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @PutMapping("/customer/{userId}/block")
    public ResponseEntity<String> blockCustomer(@PathVariable Integer userId) {
        adminService.blockCustomer(userId);
        return ResponseEntity.ok("Customer blocked successfully");
    }

    @PutMapping("/customer/{userId}/unblock")
    public ResponseEntity<String> unblockCustomer(@PathVariable Integer userId) {
        adminService.unblockCustomer(userId);
        return ResponseEntity.ok("Customer unblocked successfully");
    }

    /* ================= SALON ================= */

    @GetMapping("/salons")
    public ResponseEntity<?> getAllSalons() {
        return ResponseEntity.ok(adminService.getAllSalons());
    }

    @PutMapping("/salons/{salonId}/approve")
    public ResponseEntity<String> approveSalon(@PathVariable Long salonId) {
        adminService.approveSalon(salonId);
        return ResponseEntity.ok("Salon approved successfully");
    }

    @PutMapping("/salons/{salonId}/reject")
    public ResponseEntity<String> rejectSalon(@PathVariable Long salonId) {
        adminService.rejectSalon(salonId);
        return ResponseEntity.ok("Salon rejected successfully");
    }

    /**
     * Utility endpoint to create Owner records for users with OWNER role who don't have one
     */
    @PostMapping("/fix-owners")
    public ResponseEntity<String> fixOwnerRecords() {
        List<User> ownerUsers = userRepository.findAll().stream()
                .filter(u -> u.getUserRole() == UserRole.OWNER)
                .toList();

        int created = 0;
        for (User user : ownerUsers) {
            // Check if Owner record exists
            boolean exists = ownerRepository.findAllWithUser().stream()
                    .anyMatch(o -> o.getUser().getUserId().equals(user.getUserId()));

            if (!exists) {
                Owner owner = new Owner();
                owner.setUser(user);
                owner.setIsApproved(false);
                ownerRepository.save(owner);
                created++;
                System.out.println("✅ Created Owner record for userId: " + user.getUserId());
            }
        }

        return ResponseEntity.ok("Created " + created + " Owner records for " + ownerUsers.size() + " owner users");
    }
}
