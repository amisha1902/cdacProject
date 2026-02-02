package com.salon.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDTO {
    private String message;
    private String role;
    private Integer userId;
    private String token;

}
