package com.salon.config;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.salon.entities.Salon;
import com.salon.entities.Services;
import com.salon.entities.ServiceCategory;
import com.salon.entities.User;
import com.salon.entities.UserRole;
import com.salon.repository.SalonRepository;
import com.salon.repository.ServiceRepository;
import com.salon.repository.ServiceCategoryRepository;
import com.salon.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            SalonRepository salonRepository,
            ServiceRepository serviceRepository,
            ServiceCategoryRepository serviceCategoryRepository
    ) {
        return args -> {

            String adminEmail = "admin@gmail.com";

            // 🔍 Check if admin already exists
            if (userRepository.existsByEmail(adminEmail)) {
                System.out.println("✅ Admin already exists");
            } else {
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
            }

            // 📍 Initialize Salons
            if (salonRepository.count() == 0) {
                System.out.println("🏢 Initializing Salons...");
                
                Salon salon1 = new Salon();
                salon1.setSalonName("Prestige Salon");
                salon1.setAddress("123 Main Street, Downtown");
                salonRepository.save(salon1);

                Salon salon2 = new Salon();
                salon2.setSalonName("Glamour Beauty Hub");
                salon2.setAddress("456 Oak Avenue, Mall Area");
                salonRepository.save(salon2);

                Salon salon3 = new Salon();
                salon3.setSalonName("Royal Spa & Salon");
                salon3.setAddress("789 Park Lane, Uptown");
                salonRepository.save(salon3);

                System.out.println("✅ Salons created successfully");
            }

            // 🏷️ Initialize Service Categories
            List<ServiceCategory> categories = new ArrayList<>();
            if (salonRepository.count() > 0 && serviceRepository.count() == 0) {
                System.out.println("📋 Initializing Service Categories and Services...");
                
                // Create categories
                ServiceCategory haircare = new ServiceCategory();
                haircare.setDescription("Haircare");
                serviceCategoryRepository.save(haircare);
                categories.add(haircare);

                ServiceCategory skincare = new ServiceCategory();
                skincare.setDescription("Skin Care");
                serviceCategoryRepository.save(skincare);
                categories.add(skincare);

                ServiceCategory nails = new ServiceCategory();
                nails.setDescription("Nails");
                serviceCategoryRepository.save(nails);
                categories.add(nails);

                // Get salons
                List<Salon> salons = salonRepository.findAll();

                // Create services for each category and salon
                for (ServiceCategory category : categories) {
                    for (Salon salon : salons) {
                        if (category.getCategoryName().equals("Hair Care")) {
                            createService("Haircut & Style", "Professional haircut with styling", 
                                BigDecimal.valueOf(500), salon, category, serviceRepository);
                            createService("Hair Coloring", "Full hair coloring service", 
                                BigDecimal.valueOf(1200), salon, category, serviceRepository);
                            createService("Hair Spa", "Rejuvenating hair spa treatment", 
                                BigDecimal.valueOf(800), salon, category, serviceRepository);
                        } else if (category.getCategoryName().equals("Skin Care")) {
                            createService("Facial", "Classic facial treatment", 
                                BigDecimal.valueOf(600), salon, category, serviceRepository);
                            createService("Cleanup", "Deep skin cleanup", 
                                BigDecimal.valueOf(400), salon, category, serviceRepository);
                            createService("Threading", "Eyebrow and facial threading", 
                                BigDecimal.valueOf(150), salon, category, serviceRepository);
                        } else if (category.getCategoryName().equals("Nails")) {
                            createService("Manicure", "Complete manicure service", 
                                BigDecimal.valueOf(350), salon, category, serviceRepository);
                            createService("Pedicure", "Complete pedicure service", 
                                BigDecimal.valueOf(450), salon, category, serviceRepository);
                            createService("Gel Nails", "Gel nail extension and design", 
                                BigDecimal.valueOf(700), salon, category, serviceRepository);
                        }
                    }
                }

                System.out.println("✅ Service Categories and Services created successfully");
            }
        };
    }

    private void createService(String name, String description, BigDecimal price, 
                               Salon salon, ServiceCategory category, ServiceRepository serviceRepository) {
        Services service = new Services();
        service.setServiceName(name);
        service.setDescription(description);
        service.setBasePrice(price);
        service.setSalon(salon);
        service.setCategory(category);
        serviceRepository.save(service);
    }
}
