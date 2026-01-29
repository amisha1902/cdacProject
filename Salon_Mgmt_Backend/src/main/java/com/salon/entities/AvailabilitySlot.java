package com.salon.entities;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
  name = "availability_slot",
  uniqueConstraints = @UniqueConstraint(
    columnNames = {"salon_id", "service_id", "date", "start_time"}
  )
)
@Getter
@Setter
public class AvailabilitySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long slotId;

    private Long salonId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

//    private Integer serviceId;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private Integer capacity;           // total allowed bookings
    private Integer availableCapacity;  // remaining slots

//    @Enumerated(EnumType.STRING)
    enum SlotStatus { AVAILABLE, FULL, BLOCKED };
}

