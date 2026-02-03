package com.salon.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.customException.ResourceNotFoundException;
import com.salon.dtos.CustomerAdminDTO;
import com.salon.dtos.OwnerAdminDTO;
import com.salon.entities.Customer;
import com.salon.entities.Owner;
import com.salon.entities.User;
import com.salon.entities.UserRole;
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
    
    //===============new owner============//
    @Override
    public List<OwnerAdminDTO> getPendingOwners() {
        return userRepository
                .findByUserRole(UserRole.OWNER)
                .stream()
                .map(u -> new OwnerAdminDTO(
                        u.getUserId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getEmail(),
                        u.getIsActive(),
                        u.getUserRole()
                ))
                .toList();
    }
    @Override
    public void approveOwner(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUserRole() != UserRole.OWNER) {
            throw new RuntimeException("User is not an OWNER");
        }

        user.setIsActive(true);
        userRepository.save(user);
    }

    @Override
    public void rejectOwner(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUserRole() != UserRole.OWNER) {
            throw new RuntimeException("User is not an OWNER");
        }

        // keep inactive
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    
    //=========new customer======
    @Override
    public List<CustomerAdminDTO> getAllCustomers() {
        return userRepository.findByUserRole(UserRole.CUSTOMER)
                .stream()
                .map(u -> new CustomerAdminDTO(
                        u.getUserId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getEmail(),
                        u.getIsActive(),
                        u.getUserRole()
                ))
                .toList();
    }

    @Override
    public void blockCustomer(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    public void unblockCustomer(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        user.setIsActive(true);
        userRepository.save(user);
    }
}
