package com.jobPortal.demo.repository;

import com.jobPortal.demo.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUserIdOrderByCreatedAtDesc(Long userId);
}
