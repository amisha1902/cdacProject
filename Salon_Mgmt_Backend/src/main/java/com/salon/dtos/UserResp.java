package com.salon.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserResp {
	private Integer id;
	private String firstName;
	private String lastName;
	private String email;
	private String phone;
}
