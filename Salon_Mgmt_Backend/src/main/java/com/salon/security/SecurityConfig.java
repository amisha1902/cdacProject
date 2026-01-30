package com.salon.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // ❌ Disable default Spring Security mechanisms
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // ✅ Enable CORS
            .cors(cors -> {})

            // ❌ Stateless session (JWT only)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 🔐 Authorization rules
            .authorizeHttpRequests(auth -> auth

                // 🔓 Swagger
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()

                // 🔓 Public APIs
                .requestMatchers(
                    "/users/login",
                    "/users/register/**",
                    "/images/**"
                ).permitAll()

                // 🔐 ADMIN only
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // 🔐 Any logged-in user
                .requestMatchers(
                    "/users/profile/**",
                    "/users/change-password/**",
                    "/users/upload-image/**"
                ).authenticated()

                .anyRequest().authenticated()
            )

            // 🔐 JWT filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
