package com.jobPortal.demo.controller;

import com.jobPortal.demo.model.JobApplication;
import com.jobPortal.demo.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JobApplication>> getJobs(@PathVariable Long userId) {
        return ResponseEntity.ok(jobService.getJobsByUser(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<JobApplication> addJob(@PathVariable Long userId, @RequestBody JobApplication job) {
        return ResponseEntity.ok(jobService.addJob(userId, job));
    }

    @PutMapping("/{jobId}/user/{userId}")
    public ResponseEntity<JobApplication> updateJob(@PathVariable Long userId, @PathVariable Long jobId, @RequestBody JobApplication job) {
        return ResponseEntity.ok(jobService.updateJob(userId, jobId, job));
    }

    @DeleteMapping("/{jobId}/user/{userId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long userId, @PathVariable Long jobId) {
        try {
            jobService.deleteJob(userId, jobId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
