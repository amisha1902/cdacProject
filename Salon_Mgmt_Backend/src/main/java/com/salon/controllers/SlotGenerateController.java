package com.salon.controllers;

import org.springframework.http.ResponseEntity;
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

    @PostMapping("/{serviceId}/slots/generate")
    public ResponseEntity<?> generateSlots(
            @PathVariable Integer serviceId,
            @RequestBody @Validated SlotGenerationRequest request
    ) {
        slotGenerationService.generateSlots(serviceId, request);
        return ResponseEntity.ok().body("Slots generated successfully");
    }
}
///only admin or system will generate slot