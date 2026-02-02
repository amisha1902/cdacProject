package com.salon.controllers;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.salon.dtos.SlotGenerationRequest;
import com.salon.services.SlotGenerationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/services")
@RequiredArgsConstructor
public class SlotGenerateController {

    private final SlotGenerationService slotGenerationService;

    @PostMapping("/internal/slots/generate-now")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> forceGenerate() {
        slotGenerationService.generateSlotsForDateRange(LocalDate.now(), LocalDate.now().plusDays(1));
        return ResponseEntity.ok("Slots regenerated");
    }

}
///only admin or system will generate slot