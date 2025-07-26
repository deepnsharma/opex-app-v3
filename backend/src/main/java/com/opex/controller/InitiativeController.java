package com.opex.controller;

import com.opex.model.Initiative;
import com.opex.model.User;
import com.opex.service.InitiativeService;
import com.opex.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/initiatives")
public class InitiativeController {

    @Autowired
    private InitiativeService initiativeService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Initiative> getAllInitiatives() {
        return initiativeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Initiative> getInitiativeById(@PathVariable Long id) {
        Optional<Initiative> initiative = initiativeService.findById(id);
        return initiative.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/initiative-id/{initiativeId}")
    public ResponseEntity<Initiative> getInitiativeByInitiativeId(@PathVariable String initiativeId) {
        Optional<Initiative> initiative = initiativeService.findByInitiativeId(initiativeId);
        return initiative.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Initiative> createInitiative(@RequestBody Initiative initiative) {
        try {
            // For demo purposes, set a default user if not provided
            if (initiative.getUser() == null) {
                Optional<User> userOpt = userService.findByEmail("demo@opex.com");
                userOpt.ifPresent(initiative::setUser);
            }
            
            Initiative savedInitiative = initiativeService.save(initiative);
            return ResponseEntity.ok(savedInitiative);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Initiative> updateInitiative(@PathVariable Long id, @RequestBody Initiative initiative) {
        Optional<Initiative> existingInitiative = initiativeService.findById(id);
        if (existingInitiative.isPresent()) {
            initiative.setId(id);
            Initiative updated = initiativeService.save(initiative);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInitiative(@PathVariable Long id) {
        initiativeService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    public List<Initiative> getInitiativesByStatus(@PathVariable String status) {
        return initiativeService.findByStatus(status);
    }

    @GetMapping("/site/{site}")
    public List<Initiative> getInitiativesBySite(@PathVariable String site) {
        return initiativeService.findBySite(site);
    }

    @GetMapping("/stats/count/{status}")
    public ResponseEntity<Long> getCountByStatus(@PathVariable String status) {
        return ResponseEntity.ok(initiativeService.countByStatus(status));
    }

    @GetMapping("/stats/total-value")
    public ResponseEntity<Double> getTotalExpectedValue() {
        return ResponseEntity.ok(initiativeService.getTotalExpectedValue());
    }
}