package com.opex.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "initiatives")
public class Initiative {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String initiativeId;

    @NotBlank
    private String title;

    @NotBlank
    private String initiator;

    @NotBlank
    private String site;

    @NotNull
    private LocalDate date;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String baselineData;

    @Column(length = 1000)
    private String targetOutcome;

    private Double expectedValue;
    private Integer confidence;
    private Double estimatedCapex;

    private String status = "Draft";
    private String stage = "Initiated";
    private Integer currentStage = 1;

    @ElementCollection
    private List<String> assumptions;

    @ElementCollection
    private List<String> attachments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Initiative() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInitiativeId() { return initiativeId; }
    public void setInitiativeId(String initiativeId) { this.initiativeId = initiativeId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getInitiator() { return initiator; }
    public void setInitiator(String initiator) { this.initiator = initiator; }

    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBaselineData() { return baselineData; }
    public void setBaselineData(String baselineData) { this.baselineData = baselineData; }

    public String getTargetOutcome() { return targetOutcome; }
    public void setTargetOutcome(String targetOutcome) { this.targetOutcome = targetOutcome; }

    public Double getExpectedValue() { return expectedValue; }
    public void setExpectedValue(Double expectedValue) { this.expectedValue = expectedValue; }

    public Integer getConfidence() { return confidence; }
    public void setConfidence(Integer confidence) { this.confidence = confidence; }

    public Double getEstimatedCapex() { return estimatedCapex; }
    public void setEstimatedCapex(Double estimatedCapex) { this.estimatedCapex = estimatedCapex; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Integer getCurrentStage() { return currentStage; }
    public void setCurrentStage(Integer currentStage) { this.currentStage = currentStage; }

    public List<String> getAssumptions() { return assumptions; }
    public void setAssumptions(List<String> assumptions) { this.assumptions = assumptions; }

    public List<String> getAttachments() { return attachments; }
    public void setAttachments(List<String> attachments) { this.attachments = attachments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}