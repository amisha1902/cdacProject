package com.salon.services;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.salon.dtos.UserResp;
import com.salon.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	
	@Override
	public List<UserResp> getAllUsers() {
		return userRepository.findAll()
				.stream()
				.map(user -> modelMapper.map(user, UserResp.class))
				.toList();
	}

}
