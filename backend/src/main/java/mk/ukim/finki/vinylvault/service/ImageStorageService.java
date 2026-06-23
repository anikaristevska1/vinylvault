package mk.ukim.finki.vinylvault.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class ImageStorageService {

    @Value("${vinylvault.upload-dir:/app/uploads}")
    private String uploadDir;

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp");

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private Path uploadPath;

    @PostConstruct
    public void init() {
        try {
            uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            log.info("Upload directory initialized at: {}", uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        String originalName = file.getOriginalFilename();
        String extension = getExtension(originalName);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException(
                    "File type not allowed. Allowed: " + ALLOWED_EXTENSIONS);
        }

        String fileName = UUID.randomUUID() + "." + extension;
        Path targetPath = uploadPath.resolve(fileName);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + fileName, e);
        }

        return fileName;
    }

    public Path loadImage(String fileName) {
        Path filePath = uploadPath.resolve(fileName).normalize();
        if (!filePath.startsWith(uploadPath)) {
            throw new SecurityException("Invalid file path");
        }
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found: " + fileName);
        }
        return filePath;
    }

    public void deleteImage(String fileName) {
        if (fileName == null) return;
        try {
            Path filePath = uploadPath.resolve(fileName).normalize();
            if (filePath.startsWith(uploadPath)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            log.warn("Could not delete file {}: {}", fileName, e.getMessage());
        }
    }

    private String getExtension(String fileName) {
        if (fileName == null) return "";
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex == -1) return "";
        return fileName.substring(dotIndex + 1);
    }
}
