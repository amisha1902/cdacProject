package com.salon.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // ✅ DO NOT FILTER PUBLIC ENDPOINTS
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return path.equals("/users/login")
                || path.startsWith("/users/register")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.equals("/swagger-ui.html")
                || path.equals("/api-docs.json");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");
            String path = request.getServletPath();

            System.out.println("🔍 [JWT Filter] Path: " + path);
            System.out.println("🔍 [JWT Filter] Authorization Header: " + (authHeader != null ? "Present" : "Missing"));

            // 🔍 Only process if Authorization header exists
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                System.out.println("✅ [JWT Filter] Token found, length: " + token.length());

                // ✅ Validate and extract token data
                boolean isValid = jwtUtil.validateToken(token);
                System.out.println("🔐 [JWT Filter] Token valid: " + isValid);

                if (isValid && SecurityContextHolder.getContext().getAuthentication() == null) {

                    try {
                        Integer userId = jwtUtil.extractUserId(token);
                        String role = jwtUtil.extractRole(token);

                        System.out.println("✅ [JWT Filter] Extracted - UserId: " + userId + ", Role: " + role);

                        if (userId != null && role != null) {
                            SimpleGrantedAuthority authority =
                                    new SimpleGrantedAuthority("ROLE_" + role);

                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            userId,
                                            null,
                                            List.of(authority)
                                    );

                            authentication.setDetails(
                                    new WebAuthenticationDetailsSource().buildDetails(request)
                            );

                            SecurityContextHolder.getContext()
                                    .setAuthentication(authentication);

                            System.out.println("✅ [JWT Filter] Authentication set successfully!");
                        }
                    } catch (Exception e) {
                        System.err.println("⚠️ [JWT Filter] Error extracting token claims: " + e.getMessage());
                        e.printStackTrace();
                    }
                } else {
                    if (!isValid) {
                        System.out.println("❌ [JWT Filter] Token validation failed!");
                    }
                    if (SecurityContextHolder.getContext().getAuthentication() != null) {
                        System.out.println("ℹ️ [JWT Filter] Authentication already set");
                    }
                }
            } else {
                System.out.println("❌ [JWT Filter] No Bearer token found");
            }

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            System.err.println("🚨 [JWT Filter] Exception: " + e.getMessage());
            e.printStackTrace();
            filterChain.doFilter(request, response);
        }
    }
}
