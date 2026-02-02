package com.salon.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.salon.services.AdminService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

	@Autowired
private final AdminService adminService; 
    /* ================= CUSTOMER ================= */

    @GetMapping("/customers")
    public ResponseEntity<?> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @PutMapping("/customers/{userId}/block")
    public ResponseEntity<?> blockCustomer(@PathVariable Integer userId) {
        return ResponseEntity.ok(adminService.blockUser(userId));
    }

    @PutMapping("/customers/{userId}/unblock")
    public ResponseEntity<?> unblockCustomer(@PathVariable Integer userId) {
        return ResponseEntity.ok(adminService.unblockUser(userId));
    }

    /* ================= OWNER ================= */

    @GetMapping("/owners")
    public ResponseEntity<?> getAllOwners() {
        return ResponseEntity.ok(adminService.getAllOwners());
    }

    @PutMapping("/owners/{ownerId}/approve")
    public ResponseEntity<?> approveOwner(@PathVariable Integer ownerId) {
        return ResponseEntity.ok(adminService.approveOwner(ownerId));
    }

    @PutMapping("/owners/{ownerId}/reject")
    public ResponseEntity<?> rejectOwner(@PathVariable Integer ownerId) {
        return ResponseEntity.ok(adminService.rejectOwner(ownerId));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Integer userId, @RequestParam String role) {
        return ResponseEntity.ok(adminService.changeUserRole(userId, role));
    }
}
