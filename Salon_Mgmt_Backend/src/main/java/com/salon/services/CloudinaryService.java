package com.salon.services;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface CloudinaryService {
    String uploadImage(MultipartFile file, String folder) throws IOException;
    void deleteImage(String publicId) throws IOException;
}
