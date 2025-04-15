package com.example.project_management.controller;

import com.example.project_management.model.Collaboration;
import com.example.project_management.model.Project;
import com.example.project_management.model.User;
import com.example.project_management.repository.CollaborationRepository;
import com.example.project_management.repository.ProjectRepository;
import com.example.project_management.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
@RestController
@RequestMapping("api/collab")
public class CollaborationController {
    
    @Autowired
    private CollaborationRepository collaborationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads";

    @PostMapping(value = "/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE) 
        public ResponseEntity<?> sendMessage(
            @RequestParam("userId") Long userId,
            @RequestParam("projectId") Long projectId,
            @RequestParam("messageText") String messageText,
            @RequestParam(value = "file", required = false) MultipartFile file
        ) {
            try {
                User user = userRepository.findById(userId).orElse(null);
                Project project = projectRepository.findById(projectId).orElse(null);

                if(user == null || project == null) {
                    return ResponseEntity.badRequest().body("Invalid project or user");
                }

                String fileName = null;
                if(file != null && !file.isEmpty()) {
                    fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    File uploadDir = new File(UPLOAD_DIR);
                    if(!uploadDir.exists()) uploadDir.mkdirs();

                    file.transferTo(new File(UPLOAD_DIR + fileName));

                    // File uploadDir = new File(UPLOAD_DIR);
                    // if (!uploadDir.exists()) {
                    //     uploadDir.mkdirs();  
                    // }
        
                    fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    File destinationFile = new File(UPLOAD_DIR + File.separator + fileName);
                    file.transferTo(destinationFile);

            // Save the file to a directory or process it as needed
            // fileName = file.getOriginalFilename();
            // Path path = Paths.get(uploadDirectory, fileName);
            // Files.copy(file.getInputStream(), path);
            // Save the file information in the database if needed (e.g., file path)

                }

                Collaboration message = new Collaboration();
                message.setProject(project);
                message.setUser(user);
                message.setMessageText(messageText);;
                message.setFileName(fileName);
                message.setTimestamp(LocalDateTime.now());

                return ResponseEntity.ok(collaborationRepository.save(message));
            }
            catch(Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error sending message: " + e.getMessage());
            }
        }

        @GetMapping("/project/{projectId}")
        public ResponseEntity<?> getMessageByProject(@PathVariable Long projectId) {
            return ResponseEntity.ok(collaborationRepository.findByProjectId(projectId));
        }

        @GetMapping("all")
        public ResponseEntity<?> getAllMessages() {
            return ResponseEntity.ok(collaborationRepository.findAll());
        }

//         @PostMapping(value = "/test-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//         public ResponseEntity<String> testUpload(@RequestParam("file") MultipartFile file) {
//             return ResponseEntity.ok("Received file: " + file.getOriginalFilename());
//         }        
}
