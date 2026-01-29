package com.salon.services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.salon.dtos.GetAllSalon;
import com.salon.dtos.SalonDetailResponse;

public interface SalonService {

    public Page<GetAllSalon> getAllSalons(String search,  String state, Pageable pageable);
    SalonDetailResponse getSalonDetailsById(Long salonId);

}
