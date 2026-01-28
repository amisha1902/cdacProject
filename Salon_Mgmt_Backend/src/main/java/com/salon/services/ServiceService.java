package com.salon.services;

import com.salon.entities.ServiceRequest;
import com.salon.entities.Services;

public interface ServiceService {
    Services createService(ServiceRequest request, Integer ownerId);
    Services updateService(Integer serviceId, ServiceRequest request, Integer ownerId);
}

