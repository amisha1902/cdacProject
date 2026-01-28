package com.salon.controllers;

import java.util.List;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.salon.dtos.BookingResponse;
import com.salon.dtos.CheckoutBookingRequest;
import com.salon.services.BookingServiceService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private BookingServiceService bookingService;

    // -------- Customer APIs --------
    @PostMapping("/checkout")
    public ResponseEntity<BookingResponse> checkout(
            @RequestParam Integer userId,
            @RequestBody CheckoutBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.checkout(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @RequestParam Integer userId) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long bookingId,
            @RequestParam Integer userId) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId, userId));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBookingByCustomer(
            @PathVariable Long bookingId,
            @RequestParam Integer userId) {
        return ResponseEntity.ok(bookingService.cancelBookingByCustomer(bookingId, userId));
    }

    // -------- Owner/Admin APIs --------
    @GetMapping("/admin")
    public ResponseEntity<List<BookingResponse>> getAllBookingsByOwner(
            @RequestParam Long salonId) {
        return ResponseEntity.ok(bookingService.getAllBookingsByOwner(salonId));
    }

    @PutMapping("/admin/{bookingId}/confirm")
    public ResponseEntity<BookingResponse> confirmBookingByOwner(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.confirmBookingByOwner(bookingId));
    }

    @PutMapping("/admin/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBookingByOwner(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.cancelBookingByOwner(bookingId));
    }
}

