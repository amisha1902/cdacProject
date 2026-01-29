package com.salon.services;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.salon.dtos.CreatePaymentRequest;
import com.salon.dtos.CreatePaymentResponse;
import com.salon.dtos.PaymentResponse;
import com.salon.dtos.VerifyPaymentRequest;
import com.salon.entities.Booking;
import com.salon.entities.Payment;
import com.salon.entities.enums.BookingStatus;
import com.salon.entities.enums.PaymentStatus;
import com.salon.exceptions.ResourceNotFoundException;
import com.salon.repository.BookingRepository;
import com.salon.repository.PaymentRepository;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private BookingRepository bookingRepo;

    @Override
    public CreatePaymentResponse createPaymentOrder(CreatePaymentRequest request) {

        Booking booking = bookingRepo.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Payment not allowed for booking in status " + booking.getStatus());
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);

            Map<String, Object> options = new HashMap<>();
            options.put("amount", booking.getTotalAmount().multiply(BigDecimal.valueOf(100))); // paise
            options.put("currency", "INR");
            options.put("receipt", "booking_" + booking.getBookingId());

            Order order = client.orders.create(new JSONObject(options));

            Payment payment = new Payment();
            payment.setBookingId(booking.getBookingId());
            payment.setRazorpayOrderId(order.get("id"));
            payment.setAmount(booking.getTotalAmount());
            payment.setStatus(PaymentStatus.CREATED);

            paymentRepo.save(payment);

            CreatePaymentResponse res = new CreatePaymentResponse();
            res.setRazorpayOrderId(order.get("id"));
            res.setAmount(booking.getTotalAmount());
            res.setCurrency("INR");
            res.setKey(razorpayKey);

            return res;

        } catch (Exception e) {
            throw new RuntimeException("Error creating Razorpay order", e);
        }
    }

    @Override
    public PaymentResponse verifyAndCapturePayment(VerifyPaymentRequest request) {

        Payment payment = paymentRepo.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found"));

        try {
            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            boolean valid = Utils.verifySignature(payload, request.getRazorpaySignature(), razorpaySecret);

            if (!valid) {
                payment.setStatus(PaymentStatus.FAILED);
                paymentRepo.save(payment);
                throw new IllegalArgumentException("Invalid payment signature");
            }

            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setSignature(request.getRazorpaySignature());
            payment.setStatus(PaymentStatus.PAID);
            paymentRepo.save(payment);

            Booking booking = bookingRepo.findById(payment.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

            booking.setStatus(BookingStatus.CONFIRMED);

           PaymentResponse res = new PaymentResponse();
            res.setPaymentId(payment.getPaymentId());
            res.setBookingId(payment.getBookingId());
            res.setAmount(payment.getAmount());
            res.setStatus(payment.getStatus());

            return res;

        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed", e);
        }
    }
}
