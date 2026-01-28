package com.salon.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.salon.entities.enums.BookingStatus;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "booking_hold")
@Getter @Setter
public class BookingHold {

    @Id
    @Column(name = "hold_id")
    private String holdId;

    @Column(name = "customer_id", nullable = false)
    private Integer customerId;

    @ManyToOne
    @JoinColumn(name = "salon_id", nullable = false)
    private Salon salon;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @OneToMany(mappedBy = "hold", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingHoldItem> items = new ArrayList<>();
}
