package com.salon.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.salon.dtos.CreatePaymentRequest;
import com.salon.dtos.CreatePaymentResponse;
import com.salon.dtos.PaymentResponse;
import com.salon.dtos.VerifyPaymentRequest;
import com.salon.services.PaymentService;
import com.salon.services.BookingServiceService;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private BookingServiceService bookingService;

    // Step 1: Create Razorpay Order
    @PostMapping("/create")
    public ResponseEntity<CreatePaymentResponse> createPayment(
            @RequestBody CreatePaymentRequest request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.createPaymentOrder(request));
    }

    // Step 2: Verify Payment
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @RequestBody VerifyPaymentRequest request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return ResponseEntity.ok(paymentService.verifyAndCapturePayment(request));
    }

    // Demo payment processing (without external dependencies)
    @PostMapping("/process-demo")
    public ResponseEntity<Map<String, Object>> processDemoPayment(
            @RequestBody Map<String, Object> paymentRequest,
            Authentication authentication) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long bookingId = Long.valueOf(paymentRequest.get("bookingId").toString());
            String transactionId = paymentRequest.get("transactionId").toString();
            
            // Update booking status to CONFIRMED
            bookingService.updateBookingStatus(bookingId, "CONFIRMED");
            
            response.put("success", true);
            response.put("transactionId", transactionId);
            response.put("message", "Payment processed successfully (Demo Mode)");
            response.put("bookingId", bookingId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Payment processing failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
