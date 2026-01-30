package com.salon.services;

import java.util.List;

import com.salon.entities.Salon;

public interface AdminService {
  List<Salon> getPendingSalons();
  Salon approveSalon(Long salonId);
  Salon rejectSalon(Long salonId);
}
