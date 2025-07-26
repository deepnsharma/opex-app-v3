package com.opex.controller;

import com.opex.model.WorkflowStep;
import com.opex.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;

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
    public ResponseEntity<WorkflowStep> getWorkflowById(@PathVariable Long id) {
        Optional<WorkflowStep> workflow = workflowService.findById(id);
        return workflow.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{stepId}/approve")
    public ResponseEntity<WorkflowStep> approveStep(
            @PathVariable Long stepId, 
            @RequestBody Map<String, String> requestData) {
        
        String comments = requestData.get("comments");
        String signature = requestData.get("signature");
        
        WorkflowStep approvedStep = workflowService.approveStep(stepId, comments, signature);
        if (approvedStep != null) {
            return ResponseEntity.ok(approvedStep);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{stepId}/reject")
    public ResponseEntity<WorkflowStep> rejectStep(
            @PathVariable Long stepId, 
            @RequestBody Map<String, String> requestData) {
        
        String comments = requestData.get("comments");
        
        WorkflowStep rejectedStep = workflowService.rejectStep(stepId, comments);
        if (rejectedStep != null) {
            return ResponseEntity.ok(rejectedStep);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkflowStep> updateWorkflowStep(
            @PathVariable Long id, 
            @RequestBody WorkflowStep workflowStep) {
        
        Optional<WorkflowStep> existingStep = workflowService.findById(id);
        if (existingStep.isPresent()) {
            workflowStep.setId(id);
            WorkflowStep updated = workflowService.save(workflowStep);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}