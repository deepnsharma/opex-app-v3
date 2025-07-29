package com.opex.config;

import com.opex.model.*;
import com.opex.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.math.BigDecimal;

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

    @Autowired
    private InitiativeUnitService unitService;

    @Autowired
    private InitiativeDisciplineService disciplineService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize lookup tables
        initializeLookupTables();
        
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
        
        // Create sample initiatives
        if (initiativeService.findAll().isEmpty()) {
            createSampleInitiatives();
        }

        // Create sample KPIs
        if (kpiService.findAll().isEmpty()) {
            createSampleKPIs();
        }

        // Create sample projects
        if (projectService.findAll().isEmpty()) {
            createSampleProjects();
        }
    }

    private void initializeLookupTables() {
        // Initialize Initiative Units if empty
        if (unitService.findAll().isEmpty()) {
            unitService.save(new InitiativeUnit("NDS", "NDS", "NDS Plant"));
            unitService.save(new InitiativeUnit("HSD1", "HSD1", "HSD1 Plant"));
            unitService.save(new InitiativeUnit("HSD2", "HSD2", "HSD2 Plant"));
            unitService.save(new InitiativeUnit("HSD3", "HSD3", "HSD3 Plant"));
            unitService.save(new InitiativeUnit("DHJ", "DHJ", "DHJ Plant"));
            unitService.save(new InitiativeUnit("APL", "APL", "APL Plant"));
            unitService.save(new InitiativeUnit("TCD", "TCD", "TCD Plant"));
        }
        
        // Initialize Initiative Disciplines if empty
        if (disciplineService.findAll().isEmpty()) {
            disciplineService.save(new InitiativeDiscipline("OP", "Operation", 
                "• Plant Productivity Enhancement – w.r.t rated capacity based on previous year realization\n" +
                "• Capacity debottlenecking\n" +
                "• Raw Material (RM) norms reduction\n" +
                "• Utility norms reduction (Steam, Power, Water, etc.)\n" +
                "• Downtime reduction\n" +
                "• Inventory/ WIP reduction\n" +
                "• New Product Identification & Mapping"));
            
            disciplineService.save(new InitiativeDiscipline("EG", "Engineering & Utility", 
                "• Downtime reduction\n" +
                "• R&M (Repair and Improvement) etc.\n" +
                "• Spares Inventory reduction\n" +
                "• Improving efficiency of Utility equipments like Boiler, Chiller, etc."));
            
            disciplineService.save(new InitiativeDiscipline("EV", "Environment", 
                "• Reduction in Waste generation\n" +
                "• Effluent handling and treatment cost reduction\n" +
                "• Improving asset efficiency\n" +
                "• Valorisation initiatives etc."));
            
            disciplineService.save(new InitiativeDiscipline("SF", "Safety", 
                "• Process Safety Management etc."));
            
            disciplineService.save(new InitiativeDiscipline("QA", "Quality", 
                "• Reduction in Finished Goods rejections/ deviations\n" +
                "• Improvements in in-process quality checks"));
            
            disciplineService.save(new InitiativeDiscipline("OT", "Others", 
                "• Logistic / Transportation / Supply chain process\n" +
                "• Packaging improvements\n" +
                "• Inventory reduction"));
        }
    }

    private void createSampleInitiatives() {
        // Get lookup data
        InitiativeUnit ndsUnit = unitService.findByCode("NDS").orElse(null);
        InitiativeUnit hsd1Unit = unitService.findByCode("HSD1").orElse(null);
        InitiativeUnit aplUnit = unitService.findByCode("APL").orElse(null);
        
        InitiativeDiscipline opDiscipline = disciplineService.findByCode("OP").orElse(null);
        InitiativeDiscipline egDiscipline = disciplineService.findByCode("EG").orElse(null);
        InitiativeDiscipline evDiscipline = disciplineService.findByCode("EV").orElse(null);
        
        if (ndsUnit != null && opDiscipline != null) {
            // Initiative 1
            Initiative initiative1 = new Initiative();
            initiative1.setTitle("Energy Efficiency Optimization");
            initiative1.setDescription("Implementing LED lighting and optimizing HVAC systems to reduce energy consumption");
            initiative1.setCategory("Energy");
            initiative1.setSite("Manufacturing Plant A");
            initiative1.setUnit(ndsUnit);
            initiative1.setDiscipline(opDiscipline);
            initiative1.setProposer("John Smith");
            initiative1.setProposalDate(LocalDate.of(2025, 1, 15));
            initiative1.setExpectedClosureDate(LocalDate.of(2025, 6, 15));
            initiative1.setEstimatedSavings(new BigDecimal("50000.00"));
            initiative1.setStatus("IN_PROGRESS");
            initiative1.setPriority("HIGH");
            initiative1.setBudgetType("BUDGETED");
            initiative1.setComments("Implementing LED lighting and optimizing HVAC systems");
            initiativeService.save(initiative1);
        }
        
        if (hsd1Unit != null && egDiscipline != null) {
            // Initiative 2
            Initiative initiative2 = new Initiative();
            initiative2.setTitle("Waste Reduction Initiative");
            initiative2.setDescription("Implementing lean manufacturing principles to reduce material waste");
            initiative2.setCategory("Waste Management");
            initiative2.setSite("Manufacturing Plant B");
            initiative2.setUnit(hsd1Unit);
            initiative2.setDiscipline(egDiscipline);
            initiative2.setProposer("Emma Davis");
            initiative2.setProposalDate(LocalDate.of(2025, 1, 20));
            initiative2.setExpectedClosureDate(LocalDate.of(2025, 5, 20));
            initiative2.setEstimatedSavings(new BigDecimal("120000.00"));
            initiative2.setActualSavings(new BigDecimal("95000.00"));
            initiative2.setStatus("APPROVED");
            initiative2.setPriority("HIGH");
            initiative2.setBudgetType("NON_BUDGETED");
            initiative2.setComments("Lean manufacturing principles implementation");
            initiativeService.save(initiative2);
        }
        
        if (aplUnit != null && evDiscipline != null) {
            // Initiative 3
            Initiative initiative3 = new Initiative();
            initiative3.setTitle("Process Automation");
            initiative3.setDescription("Automating manual processes to improve efficiency and reduce errors");
            initiative3.setCategory("Automation");
            initiative3.setSite("Manufacturing Plant C");
            initiative3.setUnit(aplUnit);
            initiative3.setDiscipline(evDiscipline);
            initiative3.setProposer("Mike Chen");
            initiative3.setProposalDate(LocalDate.of(2025, 2, 1));
            initiative3.setExpectedClosureDate(LocalDate.of(2025, 8, 1));
            initiative3.setEstimatedSavings(new BigDecimal("85000.00"));
            initiative3.setStatus("PROPOSED");
            initiative3.setPriority("MEDIUM");
            initiative3.setBudgetType("BUDGETED");
            initiative3.setComments("Automation of manual processes");
            initiativeService.save(initiative3);
        }
    }

    private void createSampleKPIs() {
        // January 2024 KPIs
        KPI kpi1 = new KPI();
        kpi1.setName("Energy Savings");
        kpi1.setCategory("Energy");
        kpi1.setSite("Manufacturing Plant A");
        kpi1.setMonth("2024-01");
        kpi1.setTargetValue(new BigDecimal("10000.00"));
        kpi1.setActualValue(new BigDecimal("12000.00"));
        kpi1.setUnit("kWh");
        kpi1.setDescription("Monthly energy savings target");
        kpiService.save(kpi1);

        KPI kpi2 = new KPI();
        kpi2.setName("Cost Savings");
        kpi2.setCategory("Financial");
        kpi2.setSite("Manufacturing Plant A");
        kpi2.setMonth("2024-01");
        kpi2.setTargetValue(new BigDecimal("40000.00"));
        kpi2.setActualValue(new BigDecimal("45000.00"));
        kpi2.setUnit("USD");
        kpi2.setDescription("Monthly cost savings target");
        kpiService.save(kpi2);

        // February 2024 KPIs
        KPI kpi3 = new KPI();
        kpi3.setName("Energy Savings");
        kpi3.setCategory("Energy");
        kpi3.setSite("Manufacturing Plant A");
        kpi3.setMonth("2024-02");
        kpi3.setTargetValue(new BigDecimal("12000.00"));
        kpi3.setActualValue(new BigDecimal("15000.00"));
        kpi3.setUnit("kWh");
        kpi3.setDescription("Monthly energy savings target");
        kpiService.save(kpi3);

        KPI kpi4 = new KPI();
        kpi4.setName("Cost Savings");
        kpi4.setCategory("Financial");
        kpi4.setSite("Manufacturing Plant A");
        kpi4.setMonth("2024-02");
        kpi4.setTargetValue(new BigDecimal("50000.00"));
        kpi4.setActualValue(new BigDecimal("52000.00"));
        kpi4.setUnit("USD");
        kpi4.setDescription("Monthly cost savings target");
        kpiService.save(kpi4);
    }

    private void createSampleProjects() {
        // Get the first initiative for project creation
        if (!initiativeService.findAll().isEmpty()) {
            Initiative initiative = initiativeService.findAll().get(0);
            
            Project project = new Project();
            project.setName("LED Lighting Installation");
            project.setProjectId("PRJ-001");
            project.setInitiative(initiative);
            project = projectService.save(project);

            // Create sample tasks
            Task task1 = new Task();
            task1.setTaskId("TSK-001");
            task1.setName("Site Survey and Assessment");
            task1.setStartDate(LocalDate.of(2024, 2, 1));
            task1.setEndDate(LocalDate.of(2024, 2, 7));
            task1.setStatus("COMPLETED");
            task1.setProgress(100);
            task1.setOwner("Technical Team");
            task1.setComments("Survey completed, identified 500 fixtures for replacement");
            task1.setProject(project);
            projectService.saveTask(task1);

            Task task2 = new Task();
            task2.setTaskId("TSK-002");
            task2.setName("LED Procurement");
            task2.setStartDate(LocalDate.of(2024, 2, 8));
            task2.setEndDate(LocalDate.of(2024, 2, 15));
            task2.setStatus("IN_PROGRESS");
            task2.setProgress(75);
            task2.setOwner("Procurement Team");
            task2.setComments("Orders placed, delivery expected by 2/14");
            task2.setProject(project);
            projectService.saveTask(task2);

            Task task3 = new Task();
            task3.setTaskId("TSK-003");
            task3.setName("Installation Phase 1");
            task3.setStartDate(LocalDate.of(2024, 2, 16));
            task3.setEndDate(LocalDate.of(2024, 2, 28));
            task3.setStatus("PLANNING");
            task3.setProgress(0);
            task3.setOwner("Maintenance Team");
            task3.setComments("Waiting for equipment delivery");
            task3.setProject(project);
            projectService.saveTask(task3);
        }
    }
}