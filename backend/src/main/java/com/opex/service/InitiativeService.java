package com.opex.service;

import com.opex.model.Initiative;
import com.opex.model.WorkflowStep;
import com.opex.repository.InitiativeRepository;
import com.opex.repository.WorkflowStepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InitiativeService {

    @Autowired
    private InitiativeRepository initiativeRepository;

    @Autowired
    private WorkflowStepRepository workflowStepRepository;

    public List<Initiative> findAll() {
        return initiativeRepository.findAll();
    }

    public Optional<Initiative> findById(Long id) {
        return initiativeRepository.findById(id);
    }

    public Optional<Initiative> findByInitiativeId(String initiativeId) {
        return initiativeRepository.findByInitiativeId(initiativeId);
    }

    public Initiative save(Initiative initiative) {
        if (initiative.getInitiativeId() == null) {
            initiative.setInitiativeId("INI-" + String.format("%03d", (int)(Math.random() * 1000)));
        }
        initiative.setUpdatedAt(LocalDateTime.now());
        
        Initiative saved = initiativeRepository.save(initiative);
        
        // Create initial workflow steps
        if (saved.getId() != null && workflowStepRepository.findByInitiativeIdOrderByCreatedAtAsc(saved.getId()).isEmpty()) {
            createInitialWorkflowSteps(saved);
        }
        
        return saved;
    }

    private void createInitialWorkflowSteps(Initiative initiative) {
        String[] stages = {"Site TSD", "Unit Head", "Corporate TSD", "CMO"};
        String[] approvers = {"Site TSD Team", "Unit Head", "Corporate TSD", "CMO"};
        
        for (int i = 0; i < stages.length; i++) {
            WorkflowStep step = new WorkflowStep();
            step.setInitiative(initiative);
            step.setStage(stages[i]);
            step.setApprover(approvers[i]);
            step.setStatus(i == 0 ? "pending" : "waiting");
            workflowStepRepository.save(step);
        }
    }

    public List<Initiative> findByStatus(String status) {
        return initiativeRepository.findByStatus(status);
    }

    public List<Initiative> findBySite(String site) {
        return initiativeRepository.findBySite(site);
    }

    public Long countByStatus(String status) {
        return initiativeRepository.countByStatus(status);
    }

    public Double getTotalExpectedValue() {
        Double total = initiativeRepository.getTotalExpectedValue();
        return total != null ? total : 0.0;
    }

    public void delete(Long id) {
        initiativeRepository.deleteById(id);
    }
}