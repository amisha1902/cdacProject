package com.salon.services;

import java.util.List;

public interface AdminService {

    /* CUSTOMER */
    List<?> getAllCustomers();
    String blockUser(Integer userId);
    String unblockUser(Integer userId);

    /* OWNER */
    List<?> getAllOwners();
    String approveOwner(Integer ownerId);
    String rejectOwner(Integer ownerId);
    
    /* ROLE MANAGEMENT */
    String changeUserRole(Integer userId, String role);
}

