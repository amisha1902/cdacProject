package com.salon.entities;

import java.util.List;

import lombok.*;

@Getter
@Setter
public class SalonRequest {

	private String salonName;
	private String address;
	private String city;
	 private String state;
	    private String pincode;
	    private String phone;
	    private String email;
	    private String openingTime;
	    private String closingTime;
	    private List<String> workingDays;
}
