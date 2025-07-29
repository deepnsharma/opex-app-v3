package com.opex.service;

import com.opex.model.Initiative;
import com.opex.model.InitiativeSite;
import com.opex.model.InitiativeDiscipline;
import com.opex.model.WorkflowStep;
import com.opex.repository.InitiativeRepository;
import com.opex.repository.WorkflowStepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

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

    @Transactional
    public Initiative save(Initiative initiative) {
        if (initiative.getInitiativeId() == null || initiative.getInitiativeId().isEmpty()) {
            initiative.setInitiativeId(generateInitiativeId(initiative));
        }
        initiative.setUpdatedAt(LocalDateTime.now());
        
        Initiative saved = initiativeRepository.save(initiative);
        
        // Create initial workflow steps
        if (saved.getId() != null && workflowStepRepository.findByInitiative_IdOrderByCreatedAtAsc(saved.getId()).isEmpty()) {
            createInitialWorkflowSteps(saved);
        }
        
        return saved;
    }

    private String generateInitiativeId(Initiative initiative) {
        // Format: ZZZ/YY/XX/AB/123
        // ZZZ = Site Code (Unit Code)
        // YY = Year (last 2 digits)
        // XX = Discipline Code
        // AB = Category-specific sequential number for site (01, 02...)
        // 123 = Overall site-specific initiative number (001, 002...)
        
        String siteCode = initiative.getSite().getCode();
        String year = String.valueOf(LocalDateTime.now().getYear()).substring(2); // Last 2 digits
        String disciplineCode = initiative.getDiscipline().getCode();
        
        // Get count for this site and discipline combination in current year
        Long disciplineCount = getNextDisciplineSequence(siteCode, disciplineCode, Integer.parseInt("20" + year));
        String disciplineSeq = String.format("%02d", disciplineCount);
        
        // Get overall count for this site in current year
        Long overallCount = getNextOverallSequence(siteCode, Integer.parseInt("20" + year));
        String overallSeq = String.format("%03d", overallCount);
        
        return String.format("%s/%s/%s/%s/%s", siteCode, year, disciplineCode, disciplineSeq, overallSeq);
    }

    private Long getNextDisciplineSequence(String siteCode, String disciplineCode, int year) {
        // Count initiatives for this site-discipline combination in the current year
        return initiativeRepository.countBySiteCodeAndDisciplineCodeAndYear(siteCode, disciplineCode, year) + 1;
    }

    private Long getNextOverallSequence(String siteCode, int year) {
        // Count all initiatives for this site in the current year
        return initiativeRepository.countBySiteCodeAndYear(siteCode, year) + 1;
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

    public List<Initiative> findBySiteCode(String siteCode) {
        return initiativeRepository.findBySiteCode(siteCode);
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