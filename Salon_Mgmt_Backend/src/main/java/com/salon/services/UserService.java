package com.salon.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.salon.dtos.ApiResponse;
import com.salon.dtos.ChangePasswordDTO;
import com.salon.dtos.LoginRequestDTO;
import com.salon.dtos.LoginResponseDTO;
import com.salon.dtos.ProfileDTO;
import com.salon.dtos.UpdateProfileDTO;
import com.salon.dtos.UserRegisterDTO;
import com.salon.dtos.UserResp;

public interface UserService {
	List<UserResp> getAllUsers();
	
	ApiResponse registerCustomer(UserRegisterDTO user);
	ApiResponse registerOwner(UserRegisterDTO user);
	
	LoginResponseDTO login(LoginRequestDTO dto);
	ApiResponse deleteUser(Integer id);
	
	 // 🔹 UPDATE PROFILE (name, phone)
    ApiResponse updateProfile(Integer id, UpdateProfileDTO dto);

    // 🔹 CHANGE PASSWORD
    ApiResponse changePassword(Integer id, ChangePasswordDTO dto);

    // 🔹 UPLOAD PROFILE IMAGE
    ApiResponse uploadProfileImage(Integer id, MultipartFile file);
    
    ProfileDTO getProfile(Integer id);
}
