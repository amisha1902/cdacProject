package com.salon.controllers;

import com.salon.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

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
}
