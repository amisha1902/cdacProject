package com.salon.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.customException.ResourceNotFoundException;
import com.salon.entities.Customer;
import com.salon.entities.Owner;
import com.salon.entities.User;
import com.salon.repository.CustomerRepository;
import com.salon.repository.OwnerRepository;
import com.salon.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final OwnerRepository ownerRepository;

    /* ================= CUSTOMER ================= */

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAllWithUser();
    }

    @Override
    public String blockUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setIsActive(false);
        return "User blocked successfully";
    }

    @Override
    public String unblockUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setIsActive(true);
        return "User unblocked successfully";
    }

    /* ================= OWNER ================= */

    @Override
    public List<Owner> getAllOwners() {
        return ownerRepository.findAllWithUser();
    }

    @Override
    public String approveOwner(Integer ownerId) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Owner not found"));

        owner.setIsApproved(true);
        return "Owner approved successfully";
    }

    @Override
    public String rejectOwner(Integer ownerId) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Owner not found"));

        ownerRepository.delete(owner);
        return "Owner rejected and removed";
    }

    @Override
    public String changeUserRole(Integer userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            user.setUserRole(com.salon.entities.UserRole.valueOf(role));
            return "User role updated to " + role;
        } catch (IllegalArgumentException ex) {
            throw new com.salon.customException.ApiException("Invalid role: " + role);
        }
    }
}
