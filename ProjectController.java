package com.example.project_management.controller;

import com.example.project_management.model.*;
import com.example.project_management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.project_management.security.JwtUtil;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<?> createProject(@RequestBody Map<String, String> req, @RequestHeader("Authorization") String token) {
        String name = req.get("projectName");
        String description  = req.get("description");
        String startDate = req.get("startDate");
        String endDate = req.get("endDate");

        String jwt = token.substring(7);
        String email = jwtUtil.extractUsername(jwt);
        
        User admin = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if(admin == null || !admin.getRole().equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body("Only Admins can create projects");
        }

        Project project = new Project();
        project.setProjectName(name);
        project.setDescription(description);
        project.setStartDate(LocalDate.parse(startDate));
        project.setEndDate(LocalDate.parse(endDate));
        project.setCreatedBy(admin);

        return ResponseEntity.ok(projectRepository.save(project));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllProjects(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String email = jwtUtil.extractUsername(jwt);
        
        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);

        if(user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(projectRepository.findByCreatedById(user.getId()));
    }

    @GetMapping("/project")
    public ResponseEntity<?> getProjects() {
    // Logic to fetch projects
    List<Project> projects = projectRepository.findAll();
    return ResponseEntity.ok(projects);
   }
}
