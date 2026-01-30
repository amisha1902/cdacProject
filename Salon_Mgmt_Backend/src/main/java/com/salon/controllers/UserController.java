package com.salon.controllers;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.salon.dtos.ChangePasswordDTO;
import com.salon.dtos.LoginRequestDTO;
import com.salon.dtos.UpdateProfileDTO;
import com.salon.dtos.UserRegisterDTO;
import com.salon.dtos.UserResp;
import com.salon.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})

@RequestMapping("/users")
@Validated
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/getUsers")
	public ResponseEntity<?> getAllUsers(){
		List<UserResp> users=userService.getAllUsers();
		if(users.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT)
					.build();
		}
		return ResponseEntity.ok(users);
	}
	
	@PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(
            @Valid @RequestBody UserRegisterDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.registerCustomer(dto));
    }

    @PostMapping("/register/owner")
    public ResponseEntity<?> registerOwner(
            @Valid @RequestBody UserRegisterDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.registerOwner(dto));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(userService.login(dto));
    }
    
    @DeleteMapping("/removeUser/{id}")
    public ResponseEntity<?> removeUser(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }
    
 // 🔹 UPDATE PROFILE DETAILS
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer id,
            @RequestBody UpdateProfileDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(id, dto));
    }

    // 🔹 CHANGE PASSWORD
    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Integer id,
            @RequestBody ChangePasswordDTO dto) {
        return ResponseEntity.ok(userService.changePassword(id, dto));
    }

    // 🔹 UPLOAD PROFILE IMAGE
    @PostMapping("/upload-image/{id}")
    public ResponseEntity<?> uploadImage(
            @PathVariable Integer id,
            @RequestParam("image") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadProfileImage(id, file));
    }
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'OWNER')")
    public ResponseEntity<?> getProfile(Authentication authentication) {

        Integer userId = (Integer) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getProfile(userId));
    }






}
