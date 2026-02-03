package com.salon.services;

import java.util.List;

import com.salon.dtos.CustomerAdminDTO;
import com.salon.dtos.OwnerAdminDTO;

public interface AdminService {

    /* CUSTOMER */
    List<CustomerAdminDTO> getAllCustomers();
    void blockCustomer(Integer userId);
    void unblockCustomer(Integer userId);


  
    
    /* ROLE MANAGEMENT */
    String changeUserRole(Integer userId, String role);
    
    
    //=======OWNER=======//
    List<OwnerAdminDTO> getPendingOwners();
    void approveOwner(Integer userId);
    void rejectOwner(Integer userId);
}

