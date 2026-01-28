package com.salon.services;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.salon.Repository.SalonRepository;
import com.salon.entities.SalonRequest;
import com.salon.entities.Salon;

@Service
public class SalonServicesImplementation implements SalonServices {


	private final SalonRepository salonRepository;
	 public SalonServicesImplementation(SalonRepository salonRepository) {
	        this.salonRepository = salonRepository;
	    }
     
    
	@Override
	public Salon createSalon(Long ownerId, SalonRequest req) {
		Salon salon = Salon.builder()
				.ownerId(ownerId)
				.salonName(req.getSalonName())
                .address(req.getAddress())
                .city(req.getCity())
                .state(req.getState())
                .pincode(req.getPincode())
                .phone(req.getPhone())
                .email(req.getEmail())
                .openingTime(LocalTime.parse(req.getOpeningTime()))
                .closingTime(LocalTime.parse(req.getClosingTime()))
                .workingDays(new Gson().toJson(req.getWorkingDays())) // convert list to JSON
                .isApproved(false)
                .ratingAverage(0.0)
                .totalReviews(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
		return salonRepository.save(salon);
	}


	@Override
	public Salon updateSalon(Long salonId, Long ownerId, SalonRequest req) {
		Salon salon = salonRepository.findById(salonId)
				.orElseThrow(()-> new RuntimeException("Salon not Found"));
		
		//Security check Only owner can update
		
		if(!salon.getOwnerId().equals(ownerId)) {
			 throw new RuntimeException("You are not authorized to update this salon");
		}
		 salon.setSalonName(req.getSalonName());
		 salon.setAddress(req.getAddress());
		 salon.setCity(req.getCity());
		 salon.setState(req.getState());
		    salon.setPincode(req.getPincode());
		    salon.setPhone(req.getPhone());
		    salon.setEmail(req.getEmail());
		salon.setOpeningTime(LocalTime.parse(req.getOpeningTime()));
		salon.setClosingTime(LocalTime.parse(req.getClosingTime()));
		
		salon.setWorkingDays(new Gson().toJson(req.getWorkingDays()));
		
		salon.setUpdatedAt(LocalDateTime.now());
		
		return salonRepository.save(salon);
	}


	@Override
	public Salon uploadLogo(Long salonId, MultipartFile file, Long ownerId) throws IOException {

	    Salon salon = salonRepository.findById(salonId)
	            .orElseThrow(() -> new RuntimeException("Salon not found"));

	    if (!salon.getOwnerId().equals(ownerId)) {
	        throw new RuntimeException("Not authorized");
	    }

	    String folderPath = System.getProperty("user.dir") + "/uploads/salons/" + salonId + "/";
	    File directory = new File(folderPath);
	    if (!directory.exists()) {
	        directory.mkdirs();
	    }

	    String fileName = "logo_" + file.getOriginalFilename();
	    String filePath = folderPath + fileName;
	    File dest = new File(filePath);

	    file.transferTo(dest);

	    salon.setLogo("/uploads/salons/" + salonId + "/" + fileName);
	    salon.setUpdatedAt(LocalDateTime.now());

	    return salonRepository.save(salon);
	}
	
	
	@Override
	public Salon uploadGallery(Long salonId, List<MultipartFile> files, Long ownerId) throws IOException {

	    Salon salon = salonRepository.findById(salonId)
	            .orElseThrow(() -> new RuntimeException("Salon not found"));

	    if (!salon.getOwnerId().equals(ownerId)) {
	        throw new RuntimeException("Unauthorized");
	    }

	    String folderPath = System.getProperty("user.dir") + "/uploads/salons/" + salonId + "/gallery/";
	    File dir = new File(folderPath);
	    if (!dir.exists()) dir.mkdirs();

	    List<String> storedPaths = new ArrayList<>();

	    for (MultipartFile file : files) {
	        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
	        File dest = new File(folderPath + fileName);
	        file.transferTo(dest);
	        storedPaths.add("/uploads/salons/" + salonId + "/gallery/" + fileName);
	    }

	    
	    List<String> existing = new ArrayList<>();
	    if (salon.getGalleryImages() != null) {
	        existing = new Gson().fromJson(salon.getGalleryImages(), List.class);
	    }

	    existing.addAll(storedPaths);

	    salon.setGalleryImages(new Gson().toJson(existing));
	    salon.setUpdatedAt(LocalDateTime.now());

	    return salonRepository.save(salon);
	}


	@Override
	public Salon getMySalon(Long salonId, Long ownerId) {
		Salon salon = salonRepository.findById(salonId)
				.orElseThrow(()-> new RuntimeException("Salon not found"));
		
		if(!salon.getOwnerId().equals(ownerId)) {
			throw new RuntimeException("Unauthorized to view this Salon");
		}
		return salon;
	}

@Override
	public Salon submitSalon(Long salonId, Long ownerId) {
	    Salon salon = salonRepository.findById(salonId)
	            .orElseThrow(() -> new RuntimeException("Salon not found"));

	    // Check owner
	    if (!salon.getOwnerId().equals(ownerId)) {
	        throw new RuntimeException("Unauthorized");
	    }

	    // Cannot submit if already approved
	    if (salon.getIsApproved() != null && Boolean.TRUE.equals(salon.getIsApproved())) {
	        throw new RuntimeException("Salon is already approved");
	    }

	    // Validate logo
	    if (salon.getLogo() == null || salon.getLogo().isEmpty()) {
	        throw new RuntimeException("Logo is required before submission");
	    }

	    // Validate gallery_images
	    if (salon.getGalleryImages() == null) {
	        throw new RuntimeException("At least one gallery image is required before submission");
	    }

	   

	    salon.setUpdatedAt(LocalDateTime.now());

	    return salonRepository.save(salon);
	}






}
