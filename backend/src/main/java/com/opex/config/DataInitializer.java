package com.opex.config;

import com.opex.model.*;
import com.opex.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private InitiativeService initiativeService;

    @Autowired
    private KPIService kpiService;

    @Autowired
    private ProjectService projectService;

    @Override
    public void run(String... args) throws Exception {
        // Create demo user
        if (!userService.existsByEmail("demo@opex.com")) {
            User demoUser = new User();
            demoUser.setUsername("demo");
            demoUser.setEmail("demo@opex.com");
            demoUser.setPassword("demo123");
            demoUser.setName("Demo User");
            demoUser.setRole("TSD");
            demoUser.setSite("Manufacturing Plant A");
            userService.save(demoUser);
        }

        User demoUser = userService.findByEmail("demo@opex.com").orElse(null);
        
        // Create sample initiatives
        if (initiativeService.findAll().isEmpty() && demoUser != null) {
            createSampleInitiatives(demoUser);
        }

        // Create sample KPIs
        if (kpiService.findAll().isEmpty() && demoUser != null) {
            createSampleKPIs(demoUser);
        }

        // Create sample projects
        if (projectService.findAll().isEmpty()) {
            createSampleProjects(demoUser);
        }
    }

    private void createSampleInitiatives(User user) {
        // Initiative 1
        Initiative initiative1 = new Initiative();
        initiative1.setTitle("Energy Efficiency Optimization");
        initiative1.setInitiator("John Smith");
        initiative1.setSite("Plant A");
        initiative1.setDate(LocalDate.of(2024, 1, 15));
        initiative1.setDescription("Implementing LED lighting and optimizing HVAC systems to reduce energy consumption");
        initiative1.setBaselineData("2.5 MWh/day average consumption over 12 months");
        initiative1.setTargetOutcome("Reduce energy consumption by 15% (0.375 MWh/day)");
        initiative1.setExpectedValue(50000.0);
        initiative1.setConfidence(85);
        initiative1.setEstimatedCapex(75000.0);
        initiative1.setStatus("In Progress");
        initiative1.setStage("Unit Head Review");
        initiative1.setCurrentStage(2);
        initiative1.setAssumptions(Arrays.asList(
            "Energy prices remain stable",
            "Equipment availability 95%+",
            "Staff training completion"
        ));
        initiative1.setAttachments(Arrays.asList("energy_audit_report.pdf", "led_specifications.xlsx"));
        initiative1.setUser(user);
        initiativeService.save(initiative1);

        // Initiative 2
        Initiative initiative2 = new Initiative();
        initiative2.setTitle("Waste Reduction Initiative");
        initiative2.setInitiator("Emma Davis");
        initiative2.setSite("Plant B");
        initiative2.setDate(LocalDate.of(2024, 1, 20));
        initiative2.setDescription("Implementing lean manufacturing principles to reduce material waste");
        initiative2.setBaselineData("15% material waste rate over 12 months");
        initiative2.setTargetOutcome("Reduce waste to 8% (7% improvement)");
        initiative2.setExpectedValue(120000.0);
        initiative2.setConfidence(90);
        initiative2.setEstimatedCapex(25000.0);
        initiative2.setStatus("Approved");
        initiative2.setStage("Implementation");
        initiative2.setCurrentStage(4);
        initiative2.setAssumptions(Arrays.asList(
            "Supplier quality improvements",
            "Process standardization",
            "Employee engagement"
        ));
        initiative2.setAttachments(Arrays.asList("waste_analysis.pdf"));
        initiative2.setUser(user);
        initiativeService.save(initiative2);

        // Initiative 3
        Initiative initiative3 = new Initiative();
        initiative3.setTitle("Process Automation");
        initiative3.setInitiator("Mike Chen");
        initiative3.setSite("Plant C");
        initiative3.setDate(LocalDate.of(2024, 2, 1));
        initiative3.setDescription("Automating manual processes to improve efficiency and reduce errors");
        initiative3.setBaselineData("Current manual processing time: 4 hours/batch");
        initiative3.setTargetOutcome("Reduce processing time to 1.5 hours/batch");
        initiative3.setExpectedValue(85000.0);
        initiative3.setConfidence(80);
        initiative3.setEstimatedCapex(150000.0);
        initiative3.setStatus("Pending");
        initiative3.setStage("Site TSD");
        initiative3.setCurrentStage(1);
        initiative3.setAssumptions(Arrays.asList(
            "Technology implementation success",
            "Staff adaptation to new systems",
            "Maintenance support availability"
        ));
        initiative3.setUser(user);
        initiativeService.save(initiative3);
    }

    private void createSampleKPIs(User user) {
        // January 2024
        KPI kpi1 = new KPI();
        kpi1.setMonth(YearMonth.of(2024, 1));
        kpi1.setSite("Plant A");
        kpi1.setEnergySavings(12000.0);
        kpi1.setCostSavings(45000.0);
        kpi1.setProductivityGain(5.2);
        kpi1.setWasteReduction(3.8);
        kpi1.setCo2Reduction(2.1);
        kpi1.setCycleTimeReduction(8.5);
        kpi1.setUser(user);
        kpiService.save(kpi1);

        // February 2024
        KPI kpi2 = new KPI();
        kpi2.setMonth(YearMonth.of(2024, 2));
        kpi2.setSite("Plant A");
        kpi2.setEnergySavings(15000.0);
        kpi2.setCostSavings(52000.0);
        kpi2.setProductivityGain(6.1);
        kpi2.setWasteReduction(4.2);
        kpi2.setCo2Reduction(2.8);
        kpi2.setCycleTimeReduction(9.2);
        kpi2.setUser(user);
        kpiService.save(kpi2);

        // March 2024
        KPI kpi3 = new KPI();
        kpi3.setMonth(YearMonth.of(2024, 3));
        kpi3.setSite("Plant A");
        kpi3.setEnergySavings(18000.0);
        kpi3.setCostSavings(48000.0);
        kpi3.setProductivityGain(5.8);
        kpi3.setWasteReduction(5.1);
        kpi3.setCo2Reduction(3.2);
        kpi3.setCycleTimeReduction(7.8);
        kpi3.setUser(user);
        kpiService.save(kpi3);
    }

    private void createSampleProjects(User user) {
        // Get the first initiative for project creation
        List<Initiative> initiatives = initiativeService.findAll();
        if (!initiatives.isEmpty()) {
            Initiative initiative = initiatives.get(0);
            
            Project project = new Project();
            project.setName("LED Lighting Installation");
            project.setInitiative(initiative);
            project = projectService.save(project);

            // Create sample tasks
            Task task1 = new Task();
            task1.setName("Site Survey and Assessment");
            task1.setStartDate(LocalDate.of(2024, 2, 1));
            task1.setEndDate(LocalDate.of(2024, 2, 7));
            task1.setStatus("Completed");
            task1.setProgress(100);
            task1.setOwner("Technical Team");
            task1.setComments("Survey completed, identified 500 fixtures for replacement");
            task1.setProject(project);
            projectService.saveTask(task1);

            Task task2 = new Task();
            task2.setName("LED Procurement");
            task2.setStartDate(LocalDate.of(2024, 2, 8));
            task2.setEndDate(LocalDate.of(2024, 2, 15));
            task2.setStatus("In Progress");
            task2.setProgress(75);
            task2.setOwner("Procurement Team");
            task2.setComments("Orders placed, delivery expected by 2/14");
            task2.setProject(project);
            projectService.saveTask(task2);

            Task task3 = new Task();
            task3.setName("Installation Phase 1");
            task3.setStartDate(LocalDate.of(2024, 2, 16));
            task3.setEndDate(LocalDate.of(2024, 2, 28));
            task3.setStatus("Planning");
            task3.setProgress(0);
            task3.setOwner("Maintenance Team");
            task3.setComments("Waiting for equipment delivery");
            task3.setProject(project);
            projectService.saveTask(task3);
        }
    }
}