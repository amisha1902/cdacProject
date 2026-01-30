package com.salon.services;

import com.salon.customException.ResourceNotFoundException;
import com.salon.entities.Customer;
import com.salon.entities.Owner;
import com.salon.entities.User;
import com.salon.repository.CustomerRepository;
import com.salon.repository.OwnerRepository;
import com.salon.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
        return customerRepository.findAll();
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
        return ownerRepository.findAll();
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
}
