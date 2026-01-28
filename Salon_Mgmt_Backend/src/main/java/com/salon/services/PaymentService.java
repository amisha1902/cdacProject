package com.salon.services;

import com.salon.dtos.CreatePaymentRequest;
import com.salon.dtos.CreatePaymentResponse;
import com.salon.dtos.PaymentResponse;
import com.salon.dtos.VerifyPaymentRequest;

public interface PaymentService {

    CreatePaymentResponse createPaymentOrder(CreatePaymentRequest request);

    PaymentResponse verifyAndCapturePayment(VerifyPaymentRequest request);
}
