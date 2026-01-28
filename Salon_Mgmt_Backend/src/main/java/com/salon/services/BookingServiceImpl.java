package com.salon.services;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.dtos.BookingResponse;
import com.salon.dtos.BookingServiceResponse;
import com.salon.dtos.CheckoutBookingRequest;
import com.salon.entities.Booking;
import com.salon.entities.BookingService;
import com.salon.entities.Cart;
import com.salon.entities.CartItem;
import com.salon.entities.Salon;
import com.salon.entities.enums.BookingStatus;
import com.salon.exceptions.ResourceNotFoundException;
import com.salon.repository.BookingRepository;
import com.salon.repository.BookingServiceRepository;
import com.salon.repository.CartRepository;
import com.salon.repository.SalonRepository;

@Service
@Transactional
public class BookingServiceImpl implements BookingServiceService {

    @Autowired private CartRepository cartRepo;
    @Autowired private BookingRepository bookingRepo;
    @Autowired private BookingServiceRepository bookingServiceRepo;
    @Autowired private SalonRepository salonRepo;

    @Transactional
    public BookingResponse checkout(Integer userId, CheckoutBookingRequest request) {
        Cart cart = cartRepo.findCartWithItemsByCartId(request.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        if (!cart.getUserId().equals(userId)) {
            throw new IllegalArgumentException("This cart does not belong to you");
        }

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Salon salon = salonRepo.findById(cart.getSalonId())
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found"));

        Booking booking = new Booking();
        booking.setCustomerId(userId);
        booking.setSalon(salon);
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setBookingDate(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            validateSalonOpen(salon, item.getDate(), item.getTime());
            validateSlotAvailable(item.getService().getServiceId(), item.getDate(), item.getTime());

            BookingService bs = new BookingService();
            bs.setBooking(booking);
            bs.setService(item.getService());
            bs.setDate(item.getDate());
            bs.setStartTime(item.getTime());
            bs.setEndTime(item.getTime().plusMinutes(item.getService().getDurationMinutes()));
            bs.setPrice(item.getService().getBasePrice());

            booking.getServices().add(bs);

            total = total.add(bs.getPrice());
        }

        // ✅ Set total before saving booking
        booking.setTotalAmount(total);

        // Save booking with services
        bookingRepo.save(booking);

        // Clear cart
        cart.getItems().clear();
        cartRepo.save(cart);

        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Integer userId) {
        return bookingRepo.findByCustomerId(userId)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId, Integer userId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if(!booking.getCustomerId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }

        return mapToResponse(booking);
    }

    @Override
    public BookingResponse cancelBookingByCustomer(Long bookingId, Integer userId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if(!booking.getCustomerId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }

        if(booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Cannot cancel booking already " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsByOwner(Long salonId) {
        return bookingRepo.findBySalon_SalonId(salonId)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public BookingResponse confirmBookingByOwner(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if(booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Booking cannot be confirmed, status = " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        // TODO: Send notification to customer
        return mapToResponse(booking);
    }

    @Override
    public BookingResponse cancelBookingByOwner(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if(booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        // TODO: Send notification to customer
        return mapToResponse(booking);
    }

    private void validateSalonOpen(Salon salon, LocalDate date, LocalTime time) {
        DayOfWeek day = date.getDayOfWeek();
        if(!salon.getWorkingDays().contains(day)) {
            throw new IllegalArgumentException("Salon closed on selected date");
        }

        if(time.isBefore(salon.getOpeningTime()) || time.isAfter(salon.getClosingTime())) {
            throw new IllegalArgumentException("Time outside salon working hours");
        }
    }

    private void validateSlotAvailable(Integer serviceId, LocalDate date, LocalTime time) {
        boolean slotTaken = bookingServiceRepo.existsByService_ServiceIdAndDateAndStartTimeAndBooking_StatusNot(
                serviceId, date, time, BookingStatus.CANCELLED
        );

        if (slotTaken) {
            throw new IllegalStateException("Slot already booked");
        }
    }


    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse res = new BookingResponse();
        res.setBookingId(booking.getBookingId());
        res.setStatus(booking.getStatus());
        res.setTotalAmount(booking.getTotalAmount());

        List<BookingServiceResponse> services = booking.getServices().stream()
                .map(bs -> {
                    BookingServiceResponse dto = new BookingServiceResponse();
                    dto.setServiceId(bs.getService().getServiceId());
                    dto.setServiceName(bs.getService().getServiceName());
                    dto.setDate(bs.getDate());
                    dto.setStartTime(bs.getStartTime());
                    dto.setEndTime(bs.getEndTime());
                    dto.setPrice(bs.getPrice());
                    return dto;
                })
                .toList();

        res.setServices(services);
        return res;
    }
}
