package com.salon.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCart {

	private Integer serviceId;
    private LocalDate date;
    
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime time;
    private Integer quantity;
}
