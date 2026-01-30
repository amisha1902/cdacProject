package com.salon.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.salon.entities.User;
import com.salon.entities.UserRole;
import com.salon.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            String adminEmail = "admin@gmail.com";

            // 🔍 Check if admin already exists
            if (userRepository.existsByEmail(adminEmail)) {
                System.out.println("✅ Admin already exists");
                return;
            }

            // 🔐 Create Admin
            User admin = new User();
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setEmail(adminEmail);
            admin.setPhone("9999999999");
            admin.setUserRole(UserRole.ADMIN);

            // 🔑 Encode password
            admin.setPassword(
                    passwordEncoder.encode("Admin@123")
            );

            userRepository.save(admin);

            System.out.println("✅ Admin created successfully");
        };
    }
}
