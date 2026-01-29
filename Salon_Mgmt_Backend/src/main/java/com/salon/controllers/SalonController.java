package com.salon.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.salon.dtos.GetAllSalon;
import com.salon.dtos.SalonDetailResponse;
import com.salon.services.SalonService;

@RestController
@RequestMapping("/api/salons")
public class SalonController {

    @Autowired
    private SalonService salonService;

    @GetMapping
    public ResponseEntity<Page<GetAllSalon>> getAllSalons(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ratingAverage,desc") String sort
    ) {
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction direction = sortParams.length > 1
                ? Sort.Direction.fromString(sortParams[1])
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return ResponseEntity.ok(salonService.getAllSalons(search, state, pageable));
    }
     
    
    @GetMapping("/{salonId}")
    public ResponseEntity<SalonDetailResponse> getSalonById(@PathVariable Long salonId) {
        return ResponseEntity.ok(salonService.getSalonDetailsById(salonId));
    }
 
}
