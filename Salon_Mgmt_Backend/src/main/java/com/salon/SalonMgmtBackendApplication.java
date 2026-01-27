package com.salon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.modelmapper.*;
import org.modelmapper.convention.MatchingStrategies;

@SpringBootApplication
public class SalonMgmtBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalonMgmtBackendApplication.class, args);
	}
	
	@Bean
	public ModelMapper modelMapper() {
		// TODO Auto-generated method stub
		ModelMapper mapper = new ModelMapper();
		
		mapper.getConfiguration()
		.setMatchingStrategy(MatchingStrategies.STRICT)
		.setPropertyCondition(Conditions.isNotNull());
		
		return mapper;
	}
	
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
	
}
