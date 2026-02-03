//package com.salon.config;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.LocalTime;
//import java.util.Arrays;
//import java.util.List;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.salon.entities.Booking;
//import com.salon.entities.Customer;
//import com.salon.entities.Owner;
//import com.salon.entities.Review;
//import com.salon.entities.Salon;
//import com.salon.entities.Staff;
//import com.salon.entities.User;
//import com.salon.repository.BookingRepository;
//import com.salon.repository.CustomerRepository;
//import com.salon.repository.OwnerRepository;
//import com.salon.repository.ReviewRepository;
//import com.salon.repository.SalonRepository;
//import com.salon.repository.StaffRepository;
//import com.salon.repository.UserRepository;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class DataSeeder implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final OwnerRepository ownerRepository;
//    private final SalonRepository salonRepository;
//    private final CustomerRepository customerRepository;
//    private final BookingRepository bookingRepository;
//    private final ReviewRepository reviewRepository;
//    private final ObjectMapper objectMapper;
//
//    @Override
//    @Transactional
//    public void run(String... args) throws Exception {
//        if (reviewRepository.count() > 0) {
//            log.info("Data already exists. Skipping seeding.");
//            return;
//        }
//
//        log.info("Seeding dummy data...");
//
//        // 1. Create Owner User
//        User ownerUser = createUser("Owner", "User", "owner@example.com", "9876543210");
//        Owner owner = createOwner(ownerUser);
//
//        // 2. Create Salon
//        Salon salon = createSalon(owner);
//
//        // 3. Create Staff Users & Staff
//        User staffUser1 = createUser("Alice", "Stylist", "alice@example.com", "9876543211");
//        Staff staff1 = createStaff(salon, staffUser1, "Senior Stylist", 50000.0);
//
//        User staffUser2 = createUser("Bob", "Barber", "bob@example.com", "9876543212");
//        Staff staff2 = createStaff(salon, staffUser2, "Barber", 40000.0);
//
//        // 4. Create Customers, Bookings and Reviews
//        createReviewFlow(salon, staff1, "Charlie", "Customer", "charlie@example.com", "9876543213", 5,
//                "Amazing service! Alice is the best.", "BK-001");
//
//        createReviewFlow(salon, staff2, "Dave", "Customer", "dave@example.com", "9876543214", 4,
//                "Great cut, but a bit of wait.", "BK-002");
//
//        createReviewFlow(salon, staff1, "Eve", "Customer", "eve@example.com", "9876543215", 5,
//                "Love my new hair color!", "BK-003");
//
//        createReviewFlow(salon, staff2, "Frank", "Customer", "frank@example.com", "9876543216", 3,
//                "It was okay, expected better.", "BK-004");
//
//        createReviewFlow(salon, staff1, "Grace", "Customer", "grace@example.com", "9876543217", 5,
//                "Professional and clean salon.", "BK-005");
//
//        log.info("Dummy data seeding completed!");
//    }
//
//    private User createUser(String firstName, String lastName, String email, String phone) {
//        User user = new User();
//        user.setFirstName(firstName);
//        user.setLastName(lastName);
//        user.setEmail(email);
//        user.setPassword("password123"); // Dummy password
//        user.setPhone(phone);
//        user.setIsActive(true);
//        return userRepository.save(user);
//    }
//
//    private Owner createOwner(User user) {
//        Owner owner = new Owner();
//        owner.setUser(user);
//        owner.setBusinessLicense("LIC-123456");
//        owner.setPanNumber("ABCDE1234F");
//        owner.setIsApproved(true);
//        return ownerRepository.save(owner);
//    }
//
//    private Salon createSalon(Owner owner) {
//        Salon salon = new Salon();
//        salon.setOwner(owner);
//        salon.setSalonName("Luxe Salon & Spa");
//        salon.setAddress("123 Main St");
//        salon.setCity("Mumbai");
//        salon.setState("Maharashtra");
//        salon.setPincode("400001");
//        salon.setPhone("022-12345678");
//        salon.setEmail("contact@luxesalon.com");
//        salon.setOpeningTime(LocalTime.of(9, 0));
//        salon.setClosingTime(LocalTime.of(21, 0));
//        salon.setIsApproved(true);
//        salon.setRatingAverage(BigDecimal.ZERO);
//        salon.setTotalReviews(0);
//        return salonRepository.save(salon);
//    }
//
//    private Staff createStaff(Salon salon, User user, String position, Double salary) {
//        Staff staff = new Staff();
//        staff.setSalon(salon);
//        staff.setUser(user);
//        staff.setPosition(position);
//        staff.setSalary(BigDecimal.valueOf(salary));
//        staff.setIsActive(true);
//        return staffRepository.save(staff);
//    }
//
//    private void createReviewFlow(Salon salon, Staff staff, String fName, String lName, String email, String phone,
//            Integer rating, String comment, String bookingNum) throws Exception {
//        // Create Customer
//        User custUser = createUser(fName, lName, email, phone);
//        Customer customer = new Customer();
//        customer.setUser(custUser);
//        customer.setAddress("456 Park Ave");
//        customer.setGender(Customer.Gender.FEMALE); // Default for dummy
//        customer = customerRepository.save(customer);
//
//        // Create Completed Booking
//        Booking booking = new Booking();
//        booking.setBookingNumber(bookingNum);
//        booking.setCustomer(customer);
//        booking.setSalon(salon);
//        booking.setStaff(staff);
//        booking.setBookingDate(LocalDate.now().minusDays(2));
//        booking.setBookingTime(LocalTime.of(10, 0));
//        booking.setStatus(Booking.BookingStatus.COMPLETED);
//        booking.setTotalAmount(BigDecimal.valueOf(500.00));
//        bookingRepository.save(booking);
//
//        // Create Review - only set booking, all other relationships come from booking
//        Review review = new Review();
//        review.setBooking(booking);
//        review.setRating(rating);
//        review.setComment(comment);
//        review.setIsVerified(true);
//        review.setImages("[\"https://placehold.co/200\"]"); // Mock image
//        reviewRepository.save(review);
//
//        // Update salon stats manually for seeding
//        updateSalonStats(salon, rating);
//    }
//
//    // Simple helper to verify stats update logic from Service
//    private void updateSalonStats(Salon salon, int newRating) {
//        int count = salon.getTotalReviews() + 1;
//        double currentTotal = salon.getRatingAverage().doubleValue() * salon.getTotalReviews();
//        double newAvg = (currentTotal + newRating) / count;
//        salon.setTotalReviews(count);
//        salon.setRatingAverage(BigDecimal.valueOf(newAvg));
//        salonRepository.save(salon);
//    }
//}
