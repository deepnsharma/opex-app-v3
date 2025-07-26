package com.opex.controller;

import com.opex.service.InitiativeService;
import com.opex.service.KPIService;
import com.opex.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private InitiativeService initiativeService;

    @Autowired
    private KPIService kpiService;

    @Autowired
    private ProjectService projectService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Initiative statistics
        Long totalInitiatives = (long) initiativeService.findAll().size();
        Long approvedInitiatives = initiativeService.countByStatus("Approved");
        Long pendingInitiatives = initiativeService.countByStatus("Pending");
        Long inProgressInitiatives = initiativeService.countByStatus("In Progress");
        
        // Financial statistics
        Double totalSavings = kpiService.getTotalCostSavings();
        Double expectedValue = initiativeService.getTotalExpectedValue();
        Double avgProductivity = kpiService.getAverageProductivityGain();
        
        // Task statistics
        Long completedTasks = projectService.countTasksByStatus("Completed");
        Long inProgressTasks = projectService.countTasksByStatus("In Progress");
        Long plannedTasks = projectService.countTasksByStatus("Planning");
        
        // Calculate completion rate
        double completionRate = totalInitiatives > 0 ? 
            (approvedInitiatives.doubleValue() / totalInitiatives.doubleValue()) * 100 : 0;
        
        stats.put("totalInitiatives", totalInitiatives);
        stats.put("approvedInitiatives", approvedInitiatives);
        stats.put("pendingInitiatives", pendingInitiatives);
        stats.put("inProgressInitiatives", inProgressInitiatives);
        stats.put("totalSavings", totalSavings);
        stats.put("expectedValue", expectedValue);
        stats.put("avgProductivity", avgProductivity);
        stats.put("completedTasks", completedTasks);
        stats.put("inProgressTasks", inProgressTasks);
        stats.put("plannedTasks", plannedTasks);
        stats.put("completionRate", Math.round(completionRate));
        stats.put("targetSavings", 3000000.0); // Target for the year
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<Map<String, Object>> getRecentActivities() {
        Map<String, Object> response = new HashMap<>();
        
        // This could be enhanced to track actual activities
        // For now, returning sample data structure
        response.put("activities", new java.util.ArrayList<>());
        
        return ResponseEntity.ok(response);
    }
}