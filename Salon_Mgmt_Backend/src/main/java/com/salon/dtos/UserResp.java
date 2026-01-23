package com.salon.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserResp {
	private Integer user_id;
	private String first_name;
	private String last_name;
	private String email;
	private String phone;
}
