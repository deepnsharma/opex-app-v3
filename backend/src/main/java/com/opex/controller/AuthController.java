package com.opex.controller;

import com.opex.config.JwtUtils;
import com.opex.dto.JwtResponse;
import com.opex.dto.LoginRequest;
import com.opex.dto.MessageResponse;
import com.opex.model.User;
import com.opex.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());
        
        if (userOpt.isPresent() && userService.validatePassword(loginRequest.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            String jwt = jwtUtils.generateJwtToken(user.getUsername());
            
            return ResponseEntity.ok(new JwtResponse(jwt,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole(),
                    user.getSite()));
        }
        
        return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Invalid credentials!"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User signUpRequest) {
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getPassword(),
                signUpRequest.getName(),
                signUpRequest.getRole() != null ? signUpRequest.getRole() : "TSD",
                signUpRequest.getSite() != null ? signUpRequest.getSite() : "Manufacturing Plant A");

        userService.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}