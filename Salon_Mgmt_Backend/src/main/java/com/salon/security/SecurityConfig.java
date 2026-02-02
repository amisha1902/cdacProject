package com.salon.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Swagger & API Docs
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/api-docs.json"
                ).permitAll()

                // Public APIs - Authentication
                .requestMatchers(
                        "/users/login",
                        "/users/register/**",
                        "/error"
                ).permitAll()
                .requestMatchers(HttpMethod.POST, 
                        "/users/register/customer",
                        "/users/register/owner"
                ).permitAll()

                // Public APIs - Browse Salons & Services
                .requestMatchers(HttpMethod.GET, "/api/home/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/salons/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/services/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/slots/**").permitAll()

                // Admin
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // Cart endpoints - Authenticated users only
                .requestMatchers("/api/cart/**").authenticated()

                // Booking endpoints - Authenticated users only
                .requestMatchers("/api/bookings/**").authenticated()

                // Payment endpoints - Authenticated users only
                .requestMatchers("/api/payment/**").authenticated()

                // Profile, user management - Authenticated
                .requestMatchers("/auth/**").authenticated()

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtAuthFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
