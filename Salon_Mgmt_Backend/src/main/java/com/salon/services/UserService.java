package com.salon.services;

import java.util.List;

import com.salon.dtos.UserResp;

public interface UserService {
	List<UserResp> getAllUsers();
}
