package com.salon.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter,
            CorsConfigurationSource corsConfigurationSource
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // ✅ PRE-FLIGHT
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ✅ STATIC FILES & UPLOADS
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                // ✅ SWAGGER
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/api-docs.json"
                ).permitAll()

                // ✅ AUTH
                .requestMatchers(
                        "/users/login",
                        "/users/register/**",
                        "/error"
                ).permitAll()

                // ✅ PUBLIC
                .requestMatchers(HttpMethod.GET,
                        "/api/home/**",
                        "/api/salons/**",
                        "/api/services/**",
                        "/api/categories/**",
                        "/api/slots/**",
                        "/api/reviews/salon/**"
                ).permitAll()

                // ✅ OWNER (🔥 MISSING EARLIER 🔥)
                .requestMatchers("/api/owner/**").hasRole("OWNER")

                // ✅ ADMIN
             // ✅ ADMIN APIs
                .requestMatchers("/api/admin/**").hasRole("ADMIN")


                // ✅ AUTHENTICATED USERS
                .requestMatchers(
                        "/api/cart/**",
                        "/api/bookings/**",
                        "/api/payment/**",
                        "/users/profile",
                        "/auth/**"
                ).authenticated()

                // ✅ EVERYTHING ELSE
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtAuthFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
