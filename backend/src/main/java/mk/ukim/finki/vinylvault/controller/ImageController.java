package mk.ukim.finki.vinylvault.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.vinylvault.service.ImageStorageService;
import mk.ukim.finki.vinylvault.service.VinylRecordService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ImageController {

    private final ImageStorageService imageStorageService;
    private final VinylRecordService recordService;

    @PostMapping(value = "/records/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadCover(@PathVariable Long id,
                                            @RequestParam("file") MultipartFile file) {
        // Make sure that record exists, before uploading
        recordService.findById(id);

        // Delete old image if it exists
        String oldPath = recordService.getCoverImagePath(id);
        if (oldPath != null) {
            imageStorageService.deleteImage(oldPath);
        }

        String fileName = imageStorageService.storeImage(file);
        recordService.updateCoverImagePath(id, fileName);

        return Map.of(
                "fileName", fileName,
                "url", "/api/images/" + fileName
        );
    }

    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String fileName) throws IOException {
        Path imagePath = imageStorageService.loadImage(fileName);
        Resource resource = new UrlResource(imagePath.toUri());

        String contentType = Files.probeContentType(imagePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                .body(resource);
    }
}
