package com.salon.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.salon.customException.*;
import com.salon.dtos.*;
import com.salon.entities.User;
import com.salon.entities.UserRole;
import com.salon.repository.UserRepository;
import com.salon.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder; 
    private final JwtUtil jwtUtil;
    private static final String UPLOAD_DIR = "uploads/";

    @Override
    public List<UserResp> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserResp.class))
                .toList();
    }

    @Override
    public ApiResponse registerCustomer(UserRegisterDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ApiException("Email Already Exist!!");
        }

        User user = modelMapper.map(dto, User.class);
        user.setUserRole(UserRole.CUSTOMER);

        // 🔐 ENCODE PASSWORD
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        User savedUser = userRepository.save(user);

        return new ApiResponse(
                "New customer added with ID=" + savedUser.getUserId(),
                "SUCCESS"
        );
    }

    @Override
    public ApiResponse registerOwner(UserRegisterDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ApiException("Email Already Exist!!");
        }

        User user = modelMapper.map(dto, User.class);
        user.setUserRole(UserRole.OWNER);

        // 🔐 ENCODE PASSWORD
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        User savedUser = userRepository.save(user);

        return new ApiResponse(
                "New owner added with ID=" + savedUser.getUserId(),
                "SUCCESS"
        );
    }

    @Override
    public ApiResponse deleteUser(Integer id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id : " + id)
                );

        userRepository.delete(user);

        return new ApiResponse("User deleted successfully", "SUCCESS");
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getUserId(),
                user.getUserRole().name()
        );


        return new LoginResponseDTO(
                "Login successful",
                user.getUserRole().name(),
                user.getUserId(),
                token
        );
    }
    
    

    @Override
    public ApiResponse updateProfile(Integer id, UpdateProfileDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());

        return new ApiResponse("Profile updated successfully", "SUCCESS");
    }

    @Override
    public ApiResponse changePassword(Integer id, ChangePasswordDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new ApiException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        return new ApiResponse("Password changed successfully", "SUCCESS");
    }

    @Override
    public ApiResponse uploadProfileImage(Integer id, MultipartFile file) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Ensure directory exists
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Create unique filename
            String fileName = id + "_" + file.getOriginalFilename();            Path path = uploadPath.resolve(fileName);

            // Save file to disk
            Files.write(path, file.getBytes());

            // UPDATE DATABASE
            user.setProfileImage(fileName);
            userRepository.save(user); 

            return new ApiResponse(fileName, "SUCCESS"); // Return filename to frontend

        } catch (Exception e) {
            throw new ApiException("Image upload failed: " + e.getMessage());
        }
    }

	@Override
	public ProfileDTO getProfile(Integer id) {
		User user = userRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    System.out.println(user);
	    return modelMapper.map(user, ProfileDTO.class);
	}
}
