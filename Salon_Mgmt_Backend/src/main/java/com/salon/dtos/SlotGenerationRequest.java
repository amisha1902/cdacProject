package com.salon.dtos;


	import java.time.LocalDate;
	import jakarta.validation.constraints.Min;
	import jakarta.validation.constraints.NotNull;
	import lombok.Getter;
	import lombok.Setter;

	@Getter
	@Setter
	public class SlotGenerationRequest {

	    @NotNull
	    private LocalDate fromDate;

	    @NotNull
	    private LocalDate toDate;

	    @Min(1)
	    private Integer slotMinutes = 30;

	    @Min(1)
	    private Integer capacity;
	}


