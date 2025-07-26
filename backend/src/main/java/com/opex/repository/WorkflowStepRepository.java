package com.opex.repository;

import com.opex.model.WorkflowStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkflowStepRepository extends JpaRepository<WorkflowStep, Long> {
    List<WorkflowStep> findByInitiativeIdOrderByCreatedAtAsc(Long initiativeId);
    List<WorkflowStep> findByStatus(String status);
}