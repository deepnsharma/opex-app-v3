package com.opex.controller;

import com.opex.model.WorkflowStep;
import com.opex.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/workflow")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    @GetMapping("/initiative/{initiativeId}")
    public List<WorkflowStep> getWorkflowByInitiativeId(@PathVariable Long initiativeId) {
        return workflowService.findByInitiativeId(initiativeId);
    }

    @GetMapping("/status/{status}")
    public List<WorkflowStep> getWorkflowByStatus(@PathVariable String status) {
        return workflowService.findByStatus(status);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowStep> getWorkflowStepById(@PathVariable Long id) {
        Optional<WorkflowStep> step = workflowService.findById(id);
        return step.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{stepId}/approve")
    public ResponseEntity<WorkflowStep> approveStep(
            @PathVariable Long stepId, 
            @RequestBody Map<String, String> request) {
        
        String comments = request.get("comments");
        String signature = request.get("signature");
        
        WorkflowStep approved = workflowService.approveStep(stepId, comments, signature);
        if (approved != null) {
            return ResponseEntity.ok(approved);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{stepId}/reject")
    public ResponseEntity<WorkflowStep> rejectStep(
            @PathVariable Long stepId, 
            @RequestBody Map<String, String> request) {
        
        String comments = request.get("comments");
        
        WorkflowStep rejected = workflowService.rejectStep(stepId, comments);
        if (rejected != null) {
            return ResponseEntity.ok(rejected);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkflowStep> updateWorkflowStep(
            @PathVariable Long id, 
            @RequestBody WorkflowStep workflowStep) {
        
        Optional<WorkflowStep> existing = workflowService.findById(id);
        if (existing.isPresent()) {
            workflowStep.setId(id);
            WorkflowStep updated = workflowService.save(workflowStep);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}