package com.jobPortal.demo.service;

import com.jobPortal.demo.model.JobApplication;
import com.jobPortal.demo.model.User;
import com.jobPortal.demo.repository.JobRepository;
import com.jobPortal.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public List<JobApplication> getJobsByUser(Long userId) {
        return jobRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public JobApplication addJob(Long userId, JobApplication job) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        job.setUser(user);
        return jobRepository.save(job);
    }

    public JobApplication updateJob(Long userId, Long jobId, JobApplication jobDetails) {
        JobApplication job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this job");
        }

        job.setCompany(jobDetails.getCompany());
        job.setPosition(jobDetails.getPosition());
        job.setLocation(jobDetails.getLocation());
        job.setSalary(jobDetails.getSalary());
        job.setStatus(jobDetails.getStatus());
        job.setNotes(jobDetails.getNotes());

        return jobRepository.save(job);
    }

    public void deleteJob(Long userId, Long jobId) {
        JobApplication job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this job");
        }

        jobRepository.delete(job);
    }
}
