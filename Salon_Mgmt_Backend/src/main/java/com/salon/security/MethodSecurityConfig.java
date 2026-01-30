package com.salon.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableMethodSecurity   // 🔥 THIS IS THE MISSING PIECE
public class MethodSecurityConfig {
}
