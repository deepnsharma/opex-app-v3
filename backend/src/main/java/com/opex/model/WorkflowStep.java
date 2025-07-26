package com.opex.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_steps")
public class WorkflowStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiative_id")
    private Initiative initiative;

    private String stage;
    private String status; // pending, completed, waiting
    private String approver;
    private LocalDateTime approvalDate;
    private String comments;
    private String signature; // Base64 encoded signature

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public WorkflowStep() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Initiative getInitiative() { return initiative; }
    public void setInitiative(Initiative initiative) { this.initiative = initiative; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getApprover() { return approver; }
    public void setApprover(String approver) { this.approver = approver; }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { this.approvalDate = approvalDate; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}