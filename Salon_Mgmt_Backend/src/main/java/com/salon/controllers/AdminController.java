package com.salon.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.entities.Salon;
import com.salon.services.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/salons")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/pending")
    public List<Salon> getPendingSalons(){
        return adminService.getPendingSalons();
    }

    @PutMapping("/{salonId}/approve")
    public Salon approveSalon(@PathVariable Long salonId) {
        return adminService.approveSalon(salonId);
    }

    @PutMapping("/{salonId}/reject")
    public Salon rejectSalon(@PathVariable Long salonId) {
        return adminService.rejectSalon(salonId);
    }
}
