package com.salon.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.salon.entities.Salon;
import com.salon.entities.SalonRequest;
import com.salon.services.SalonServicesImplementation;



@RestController
@RequestMapping("/api/owners/salons")
public class OwnerController {

	private final SalonServicesImplementation salonServices;
	
	public OwnerController(SalonServicesImplementation salonServices) {
		this.salonServices = salonServices;
	}
	
	@PostMapping
	public Salon createSalon(@RequestHeader("Owner-Id") Integer ownerId,
			@RequestBody SalonRequest req) {
		return salonServices.createSalon(ownerId, req);
	}
	
	@PutMapping("/{salonId}")
	public Salon updateSalon(@PathVariable Long salonId,
			@RequestHeader("Owner-Id") Integer ownerId,
			@RequestBody SalonRequest req
			) {
		return salonServices.updateSalon(salonId, ownerId, req);
	}
	
	@PostMapping(value="/{salonId}/logo",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Salon uploadLogo(@PathVariable Long salonId,
	        @RequestHeader("Owner-Id") Integer ownerId,
	        @RequestParam("file") MultipartFile file) throws IOException {
		 return salonServices.uploadLogo(salonId, file, ownerId);
	}
	
	@PostMapping(
	        value = "/{salonId}/images",
	        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
	)
	public Salon uploadGallery(
	        @PathVariable Long salonId,
	        @RequestHeader("Owner-Id") Integer ownerId,
	        @RequestPart("files") List<MultipartFile> files
	) throws IOException {
	    return salonServices.uploadGallery(salonId, files, ownerId);
	}

  @GetMapping("/{salonId}")
  public Salon getMySalon(@PathVariable Long salonId,
		  @RequestHeader("Owner-Id") Integer ownerId) {
	  return salonServices.getMySalon(salonId, ownerId);
  }
	
  @PostMapping("/{salonId}/submit")
  public Salon submitSalon(
          @PathVariable Long salonId,
          @RequestHeader("Owner-Id") Integer ownerId
  ) {
      return salonServices.submitSalon(salonId, ownerId);
  }

}
