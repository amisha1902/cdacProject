package com.salon.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCartRequest {

	private Integer quantity;
	private LocalDate date;
	private LocalTime time;
}
