package com.salon.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="admin")
@Getter
@Setter
public class Admin {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="admin_id")
   private Integer adminId;
	@Column(name="user_id", nullable=false)
	private Integer userId;
	
	@Enumerated(EnumType.STRING)
	@Column(name="admin_level",nullable=false)
	private AdminLevel adminLevel;
	
	@Column(name="permissions", columnDefinition = "json")
	private String permissions;
}
