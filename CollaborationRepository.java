package com.example.project_management.repository;

import com.example.project_management.model.Collaboration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CollaborationRepository extends JpaRepository<Collaboration, Long>{
    List<Collaboration> findByProjectId(Long projectId);
}
