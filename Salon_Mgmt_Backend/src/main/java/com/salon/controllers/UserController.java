package com.salon.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import org.springframework.web.multipart.MultipartFile;

import com.salon.dtos.*;
import com.salon.services.UserService; 

import jakarta.validation.Valid;

// 🔽 Swagger imports
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/users")
@Validated
@SecurityRequirement(name = "bearerAuth")   // ✅ ALL /users APIs REQUIRE JWT
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getUsers")
    public ResponseEntity<?> getAllUsers() {
        List<UserResp> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(users);
    }

    // 🔓 PUBLIC
    @PostMapping("/register/customer") 
    @Operation(security = {})
    public ResponseEntity<?> registerCustomer(
            @Valid @RequestBody UserRegisterDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.registerCustomer(dto));
    }

    // 🔓 PUBLIC
    @PostMapping("/register/owner")
    @Operation(security = {})
    public ResponseEntity<?> registerOwner(
            @Valid @RequestBody UserRegisterDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.registerOwner(dto));
    }

    // 🔓 PUBLIC
    @PostMapping("/login")
    @Operation(security = {})
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(userService.login(dto));
    }

    @DeleteMapping("/removeUser/{id}")
    public ResponseEntity<?> removeUser(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer id,
            @RequestBody UpdateProfileDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(id, dto)); 
    }

    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Integer id,
            @RequestBody ChangePasswordDTO dto) {
        return ResponseEntity.ok(userService.changePassword(id, dto));         
    }    
    @PostMapping(value="/upload-image/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> uploadImage(
       @PathVariable Integer id,
       @RequestParam("image") MultipartFile file) {
   return ResponseEntity.ok(userService.uploadProfileImage(id, file));
}


    // 🔐 JWT REQUIRED
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER','OWNER')")
    public ResponseEntity<?> getProfile(Authentication authentication) {

        Integer userId = (Integer) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getProfile(userId));
    }
}
