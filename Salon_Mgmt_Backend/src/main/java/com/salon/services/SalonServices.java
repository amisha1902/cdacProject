package com.salon.services;

import com.salon.entities.SalonRequest;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.salon.entities.Salon;

public interface SalonServices {
  public Salon createSalon(Long ownerId,SalonRequest req);
  public Salon updateSalon(Long salonId, Long ownerId, SalonRequest req);
  public Salon uploadLogo(Long salonId, MultipartFile file, Long ownerId) throws IOException;
  public Salon uploadGallery(Long salonId, List<MultipartFile> files, Long ownerId) throws IOException ;
  
  public Salon getMySalon(Long salonId, Long ownerId);
  public Salon submitSalon(Long salonId, Long ownerId);
}
