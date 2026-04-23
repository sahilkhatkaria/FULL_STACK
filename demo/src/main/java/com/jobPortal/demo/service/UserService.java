package com.jobPortal.demo.service;

import com.jobPortal.demo.dto.AuthRequest;
import com.jobPortal.demo.dto.UserResponse;
import com.jobPortal.demo.model.User;
import com.jobPortal.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse signup(AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In a real app, hash this!
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail());
    }

    public UserResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
