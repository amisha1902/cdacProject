package com.salon.services;

import java.util.List;

import com.salon.dtos.BookingResponse;
import com.salon.dtos.CheckoutBookingRequest;

public interface BookingServiceService {

    BookingResponse checkout(Integer userId, CheckoutBookingRequest request);

    List<BookingResponse> getMyBookings(Integer userId);

    BookingResponse getBookingById(Long bookingId, Integer userId);

    BookingResponse cancelBookingByCustomer(Long bookingId, Integer userId);

    List<BookingResponse> getAllBookingsByOwner(Long salonId);

    BookingResponse confirmBookingByOwner(Long bookingId);

    BookingResponse cancelBookingByOwner(Long bookingId);
    
    BookingResponse updateBookingStatus(Long bookingId, String status);
}
