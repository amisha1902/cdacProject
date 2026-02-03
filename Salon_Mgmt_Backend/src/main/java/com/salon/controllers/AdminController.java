package com.salon.controllers;

import java.util.List;

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

//    /* ================= CUSTOMER ================= */
//
//    @GetMapping("/customers")
//    public ResponseEntity<?> getAllCustomers() {
//        return ResponseEntity.ok(adminService.getAllCustomers());
//    }
//
//    @PutMapping("/customers/{userId}/block")
//    public ResponseEntity<?> blockCustomer(@PathVariable Integer userId) {
//        return ResponseEntity.ok(adminService.blockUser(userId));
//    }
//
//    @PutMapping("/customers/{userId}/unblock")
//    public ResponseEntity<?> unblockCustomer(@PathVariable Integer userId) {
//        return ResponseEntity.ok(adminService.unblockUser(userId));
//    }

    /* ================= OWNER ================= */

//    @GetMapping("/owners")
//    public ResponseEntity<?> getAllOwners() {
//        return ResponseEntity.ok(adminService.getAllOwners());
//    }
//
//    @PutMapping("/owners/{ownerId}/approve")
//    public ResponseEntity<?> approveOwner(@PathVariable Integer ownerId) {
//        return ResponseEntity.ok(adminService.approveOwner(ownerId));
//    }
//
//    @PutMapping("/owners/{ownerId}/reject")
//    public ResponseEntity<?> rejectOwner(@PathVariable Integer ownerId) {
//        return ResponseEntity.ok(adminService.rejectOwner(ownerId));
//    }

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
}
