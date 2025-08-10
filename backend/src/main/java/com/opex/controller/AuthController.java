package com.opex.controller;

import com.opex.config.JwtUtils;
import com.opex.dto.JwtResponse;
import com.opex.dto.LoginRequest;
import com.opex.dto.MessageResponse;
import com.opex.dto.SignupRequest;
import com.opex.model.Role;
import com.opex.model.User;
import com.opex.service.RoleService;
import com.opex.service.UserService;
import javax.validation.Valid;
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
    private RoleService roleService;

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
                    user.getFullName(),
                    user.getRoleCode(),
                    user.getSiteCode()));
        }
        
        return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Invalid credentials!"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Validate email domain
        if (!signUpRequest.getEmail().endsWith("@godeepak.com")) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email must be from @godeepak.com domain!"));
        }

        // Validate password confirmation
        if (!signUpRequest.getPassword().equals(signUpRequest.getConfirmPassword())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Passwords do not match!"));
        }

        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Get role from database
        Optional<Role> roleOpt = roleService.findById(signUpRequest.getRoleId());
        if (!roleOpt.isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid role selected!"));
        }

        Role role = roleOpt.get();
        
        // Validate that the role belongs to the selected site
        if (!role.getSiteCode().equals(signUpRequest.getSiteCode())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Role does not belong to selected site!"));
        }

        User user = new User(
            signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            signUpRequest.getPassword(),
            signUpRequest.getFirstName(),
            signUpRequest.getLastName(),
            role,
            signUpRequest.getSiteCode(),
            signUpRequest.getSiteName()
        );

        userService.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}