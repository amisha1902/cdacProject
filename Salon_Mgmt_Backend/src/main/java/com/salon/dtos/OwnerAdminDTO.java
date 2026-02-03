package com.salon.dtos;

import com.salon.entities.UserRole;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OwnerAdminDTO {

    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private Boolean isActive;
    private UserRole userRole;
}
