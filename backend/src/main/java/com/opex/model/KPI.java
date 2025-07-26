package com.opex.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Entity
@Table(name = "kpis")
public class KPI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private YearMonth month;
    private String site;

    private Double energySavings;
    private Double costSavings;
    private Double productivityGain;
    private Double wasteReduction;
    private Double co2Reduction;
    private Double cycleTimeReduction;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public KPI() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public YearMonth getMonth() { return month; }
    public void setMonth(YearMonth month) { this.month = month; }

    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }

    public Double getEnergySavings() { return energySavings; }
    public void setEnergySavings(Double energySavings) { this.energySavings = energySavings; }

    public Double getCostSavings() { return costSavings; }
    public void setCostSavings(Double costSavings) { this.costSavings = costSavings; }

    public Double getProductivityGain() { return productivityGain; }
    public void setProductivityGain(Double productivityGain) { this.productivityGain = productivityGain; }

    public Double getWasteReduction() { return wasteReduction; }
    public void setWasteReduction(Double wasteReduction) { this.wasteReduction = wasteReduction; }

    public Double getCo2Reduction() { return co2Reduction; }
    public void setCo2Reduction(Double co2Reduction) { this.co2Reduction = co2Reduction; }

    public Double getCycleTimeReduction() { return cycleTimeReduction; }
    public void setCycleTimeReduction(Double cycleTimeReduction) { this.cycleTimeReduction = cycleTimeReduction; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}