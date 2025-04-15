package com.example.project_management.controller;

import com.example.project_management.model.*;
import com.example.project_management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTask(@RequestBody Map<String, String> request) {
        logger.info("Received request to create Task: {}", request);
        Long projectId = Long.parseLong(request.get("project_id"));
        Long assignedToId = Long.parseLong(request.get("assigned_to"));

        logger.info("Project ID received: {}", projectId);
        logger.info("Assigned to ID received: {}", assignedToId);

        Project project = projectRepository.findById(projectId).orElse(null);
        User user = userRepository.findById(assignedToId).orElse(null);

        if (project == null) {
            logger.error("Project with ID {} not found.", projectId);
        }
        if (user == null) {
            logger.error("User with ID {} not found.", assignedToId);
        }  

        if(project == null || user == null) {
            return ResponseEntity.badRequest().body("Invalid project or user");
        }

        Task task = new Task();
        task.setTaskName(request.get("taskName"));
        task.setPriority(request.get("priority"));
        task.setStatus(request.get("status"));
        task.setDueDate(LocalDate.parse(request.get("dueDate")));
        task.setProject(project);
        task.setAssignedTo(user);

        System.out.println("Received Task: " + task);
        System.out.println("Project ID: " + task.getProject().getId());        

        Task savedTask = taskRepository.save(task);
        logger.info("Task created successfully: {}", savedTask);

        return ResponseEntity.ok(savedTask);
    }

    @PutMapping("/update/{taskId}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody Map<String, String> request) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if(task == null) return ResponseEntity.badRequest().body("Task not found");

        if(request.containsKey("taskName")) task.setTaskName(request.get("taskName"));
        if(request.containsKey("priority")) task.setPriority(request.get("priority"));
        if(request.containsKey("status")) task.setStatus(request.get("status"));
        if(request.containsKey("dueDate")) task.setDueDate(LocalDate.parse(request.get("dueDate")));

        if(request.containsKey("assignedToId")) {
            Long assignedToId = Long.parseLong(request.get("assignedToId"));
            User user = userRepository.findById(assignedToId).orElse(null);
            if(user != null) task.setAssignedTo(user);
        }
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @DeleteMapping("/{taskId}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        if(!taskRepository.existsById(taskId)) {
            return ResponseEntity.badRequest().body("Task not found");
        }
        taskRepository.deleteById(taskId);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getTasksByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskRepository.findByProjectId(projectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTasksByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskRepository.findByAssignedToId(userId));
    }

    @GetMapping("/task")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return ResponseEntity.ok(tasks);
    }
}
