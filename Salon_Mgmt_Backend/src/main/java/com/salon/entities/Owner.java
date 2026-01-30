package com.salon.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="owner")
@Data
public class Owner {
  
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="owner_id")
	private Integer ownerId;
	
	@Column(name="user_id" , nullable = false )
	private Integer userId;
	
	@Column(name = "is_approved" , columnDefinition = "TINYINT(1)")
	private Boolean isApproved = false;
	
	@Column(name="approval_date")
	private LocalDateTime approvalDate;
	
	@Column(name="business_license")
	private String businessLicense;
	
	@Column(name="pan_number")
	private String panNumber;
	
//	 @ManyToOne(fetch = FetchType.LAZY)
//	    @JoinColumn(
//	        name = "user_id",
//	        nullable = false,
//	        foreignKey = @ForeignKey(name = "fk_owner_user")
//	    )
//	    private User user;
}
