package com.example.project_management.repository;

import com.example.project_management.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long>{
    List<Project> findByCreatedById(Long userId);
} 
