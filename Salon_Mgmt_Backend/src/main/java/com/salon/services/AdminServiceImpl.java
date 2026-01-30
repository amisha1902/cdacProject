package com.salon.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.Repository.SalonRepository;
import com.salon.entities.Salon;

@Service
public class AdminServiceImpl implements AdminService {

    private final SalonRepository salonRepository;

    public AdminServiceImpl(SalonRepository salonRepository) {
        this.salonRepository = salonRepository;
    }

    @Override
    public List<Salon> getPendingSalons() {
        return salonRepository.findByIsApproved(0); // 0 = pending
    }

    @Override
    public Salon approveSalon(Long salonId) {
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new RuntimeException("Salon not found"));

        salon.setIsApproved(1); 
        salon.setUpdatedAt(LocalDateTime.now());

        return salonRepository.save(salon);
    }

    @Override
    public Salon rejectSalon(Long salonId) {
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new RuntimeException("Salon not found"));

        salon.setIsApproved(2);
        salon.setUpdatedAt(LocalDateTime.now());

        return salonRepository.save(salon);
    }
}
