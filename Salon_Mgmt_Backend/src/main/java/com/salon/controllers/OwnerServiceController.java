package com.salon.controllers;


import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.entities.ServiceRequest;
import com.salon.services.ServiceService;
import com.salon.entities.Services;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/owners")
@RequiredArgsConstructor
public class OwnerServiceController {

    private final ServiceService serviceService;

   @PostMapping
public Services createService(
        @RequestHeader(value = "Owner-Id", required = true) Integer ownerId,
        @RequestBody ServiceRequest request) {
    return serviceService.createService(request, ownerId);
}


    @PutMapping("/services/{serviceId}")
    public Services updateService(
            @PathVariable Integer serviceId,
            @RequestBody ServiceRequest request,
            @RequestHeader("Owner-Id") Integer ownerId
    ) {
        return serviceService.updateService(serviceId, request, ownerId);
    }
}
