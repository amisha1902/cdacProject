package com.salon.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.salon.dtos.SlotResponse;
import com.salon.services.GetAvailableSlotsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/salons")
@RequiredArgsConstructor
public class GetAvailableSlotsController {

    private final  GetAvailableSlotsService slots;

    @GetMapping("/{salonId}/services/{serviceId}/availability")
    public ResponseEntity<List<SlotResponse>> getAvailability(
            @PathVariable Long salonId,
            @PathVariable Integer serviceId
    ) {
        return ResponseEntity.ok(slots.getNext3DaysSlots(salonId, serviceId));
    }
}
