package com.salon.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.salon.entities.User;
import com.salon.entities.UserRole;
import com.salon.repository.UserRepository;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    @Bean
    @Transactional
    CommandLineRunner initAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            String adminEmail = "admin@gmail.com";

            if (userRepository.existsByEmail(adminEmail)) {
                log.info("Admin already exists: {}", adminEmail);
                return;
            }

            User admin = new User();
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setEmail(adminEmail);
            admin.setPhone("9999999999");
            admin.setUserRole(UserRole.ADMIN);
            admin.setIsActive(true);
            admin.setPassword(passwordEncoder.encode("Admin@123"));

            userRepository.save(admin);

            log.info("Admin created successfully: {}", adminEmail);
        };
    }
}
