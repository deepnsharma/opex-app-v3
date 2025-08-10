package com.opex.config;

import com.opex.model.*;
import com.opex.repository.*;
import com.opex.service.UserService;
import com.opex.service.RoleService;
import com.opex.service.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.math.BigDecimal;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private InitiativeSiteRepository siteRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private StageService stageService;

    @Autowired
    private InitiativeRepository initiativeRepository;

    @Autowired
    private WorkflowStepRepository workflowStepRepository;

    @Autowired
    private KPIRepository kpiRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sites
        initializeSites();
        
        // Initialize roles
        initializeRoles();
        
        // Initialize stages
        initializeStages();
        
        // Initialize users
        initializeUsers();
        
        // Initialize initiatives
        initializeInitiatives();
        
        // Initialize workflow steps
        initializeWorkflowSteps();
        
        // Initialize KPIs
        initializeKPIs();
    }

    private void initializeSites() {
        if (siteRepository.count() == 0) {
            List<InitiativeSite> sites = Arrays.asList(
                new InitiativeSite("NDS", "NDS Plant", "Manufacturing"),
                new InitiativeSite("HSD1", "HSD1 Plant", "Manufacturing"),
                new InitiativeSite("HSD2", "HSD2 Plant", "Manufacturing"),
                new InitiativeSite("HSD3", "HSD3 Plant", "Manufacturing"),
                new InitiativeSite("DHJ", "DHJ Plant", "Manufacturing"),
                new InitiativeSite("APL", "APL Plant", "Manufacturing"),
                new InitiativeSite("TCD", "TCD Plant", "Manufacturing")
            );
            siteRepository.saveAll(sites);
            System.out.println("Initialized " + sites.size() + " sites.");
        }
    }

    private void initializeRoles() {
        if (roleService.findAll().size() == 0) {
            List<InitiativeSite> sites = siteRepository.findAll();
            
            for (InitiativeSite site : sites) {
                // Create roles for each site
                List<Role> siteRoles = Arrays.asList(
                    new Role("STLD", "Site TSD Lead", "Site TSD Lead responsible for initiative registration and process management", site.getCode(), site.getName()),
                    new Role("SH", "Site Head", "Site Head responsible for approvals", site.getCode(), site.getName()),
                    new Role("EH", "Engg Head", "Engineering Head responsible for defining responsibilities and selecting initiative lead", site.getCode(), site.getName()),
                    new Role("IL", "Initiative Lead", "Initiative Lead responsible for MOC, CAPEX and timeline preparation", site.getCode(), site.getName())
                );
                
                for (Role role : siteRoles) {
                    roleService.save(role);
                }
            }
            
            // Create corporate role (CTSD - Corp TSD)
            Role ctsdRole = new Role("CTSD", "Corp TSD", "Corporate TSD responsible for periodic status review", "CORP", "Corporate");
            roleService.save(ctsdRole);
            
            System.out.println("Initialized roles for all sites and corporate.");
        }
    }

    private void initializeStages() {
        if (stageService.findAll().size() == 0) {
            List<Stage> stages = Arrays.asList(
                new Stage(1, "Register initiative", "Site TSD Lead", "STLD", null, "Initial registration of the initiative"),
                new Stage(2, "Approval", "Site Head", "SH", null, "Site head approval of the initiative"),
                new Stage(3, "Define Responsibilities", "Engg Head", "EH", "Annexure 2", "Engineering head defines responsibilities and selects initiative lead"),
                new Stage(4, "MOC required?", "Initiative Lead", "IL", null, "Determine if Management of Change is required"),
                new Stage(5, "MOC", "Initiative Lead", "IL", null, "Complete Management of Change process if required"),
                new Stage(6, "CAPEX required?", "Initiative Lead", "IL", null, "Determine if Capital Expenditure approval is required"),
                new Stage(7, "CAPEX Process", "Site TSD Lead", "STLD", null, "Complete Capital Expenditure approval process if required"),
                new Stage(8, "Prepare Initiative Timeline Tracker", "Initiative Lead", "IL", "Annexure 3", "Prepare detailed timeline for initiative implementation"),
                new Stage(9, "Trial Implementation & Performance Check", "Site TSD Lead", "STLD", null, "Implement trial and check performance"),
                new Stage(10, "Periodic Status Review with CMO", "Corp TSD", "CTSD", null, "Corporate review with Chief Manufacturing Officer"),
                new Stage(11, "Savings Monitoring for 1 month", "Site TSD Lead", "STLD", null, "Monitor savings for one month period"),
                new Stage(12, "Saving Validation with F&A", "Site TSD Lead", "STLD", null, "Validate savings with Finance and Accounts"),
                new Stage(13, "Initiative Closure", "Site TSD Lead", "STLD", null, "Close the initiative after successful completion")
            );
            
            // Set MOC and CAPEX requirements for specific stages
            stages.get(3).setRequiresMoc(true); // Stage 4
            stages.get(4).setRequiresMoc(true); // Stage 5
            stages.get(5).setRequiresCapex(true); // Stage 6
            stages.get(6).setRequiresCapex(true); // Stage 7
            
            for (Stage stage : stages) {
                stageService.save(stage);
            }
            
            System.out.println("Initialized " + stages.size() + " workflow stages.");
        }
    }

    private void initializeUsers() {
        if (userService.count() == 0) {
            List<InitiativeSite> sites = siteRepository.findAll();

            // Create users for each site
            for (InitiativeSite site : sites) {
                List<Role> siteRoles = roleService.findBySite(site.getCode());
                
                for (Role role : siteRoles) {
                    String username = site.getCode().toLowerCase() + "_" + role.getCode().toLowerCase();
                    String email = username + "@godeepak.com";
                    
                    User user = new User(
                        username,
                        email,
                        "password123",
                        role.getName().split(" ")[0], // First part as first name
                        role.getName().split(" ")[role.getName().split(" ").length - 1], // Last part as last name
                        role,
                        site.getCode(),
                        site.getName()
                    );
                    userService.save(user);
                }
            }
            
            // Create corporate user (CTSD)
            Role ctsdRole = roleService.findByCode("CTSD").get(0);
            User ctsdUser = new User(
                "corp_ctsd",
                "corp_ctsd@godeepak.com",
                "password123",
                "Corporate",
                "TSD",
                ctsdRole,
                "CORP",
                "Corporate"
            );
            userService.save(ctsdUser);

            System.out.println("Initialized users for all sites and roles.");
        }
    }

    private void initializeInitiatives() {
        if (initiativeRepository.count() == 0) {
            List<InitiativeSite> sites = siteRepository.findAll();
            Random random = new Random();

            for (InitiativeSite site : sites) {
                // Create 3-5 initiatives per site
                int initiativeCount = 3 + random.nextInt(3);
                for (int i = 1; i <= initiativeCount; i++) {
                    Initiative initiative = new Initiative();
                    initiative.setTitle("Cost Reduction Initiative " + i + " - " + site.getCode());
                    initiative.setDescription("Initiative to reduce operational costs in " + site.getName());
                    initiative.setSiteCode(site.getCode());
                    initiative.setSiteName(site.getName());
                    
                    // Find STLD for this site
                    Optional<Role> stldRole = roleService.findByCodeAndSite("STLD", site.getCode());
                    if (stldRole.isPresent()) {
                        initiative.setInitiator(site.getCode().toLowerCase() + "_stld@godeepak.com");
                    }
                    
                    initiative.setCurrentStage("submitted");
                    initiative.setStatus("active");
                    initiative.setTargetSavings(100000.0 + random.nextDouble() * 500000.0);
                    initiative.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(90)));
                    initiativeRepository.save(initiative);
                }
            }
            System.out.println("Initialized initiatives for all sites.");
        }
    }

    private void initializeWorkflowSteps() {
        if (workflowStepRepository.count() == 0) {
            List<Initiative> initiatives = initiativeRepository.findAll();
            List<Stage> stages = stageService.findAllActiveOrdered();
            Random random = new Random();

            String[] statuses = {"completed", "pending", "approved"};

            for (Initiative initiative : initiatives) {
                // Create 2-4 workflow steps per initiative
                int stepCount = 2 + random.nextInt(3);
                for (int i = 0; i < stepCount && i < stages.size(); i++) {
                    WorkflowStep step = new WorkflowStep();
                    step.setInitiative(initiative);
                    step.setStage(stages.get(i));
                    step.setStepNumber(i + 1);
                    step.setStatus(i < stepCount - 1 ? "completed" : statuses[random.nextInt(statuses.length)]);
                    step.setApprover(initiative.getSiteCode().toLowerCase() + "_sh@godeepak.com");
                    step.setApprovalDate(i < stepCount - 1 ? 
                        LocalDateTime.now().minusDays(random.nextInt(30)) : null);
                    step.setComments("Step " + (i + 1) + " processed for " + initiative.getTitle());
                    
                    // Set MOC/CAPEX details for relevant stages
                    if (stages.get(i).getRequiresMoc() != null && stages.get(i).getRequiresMoc()) {
                        step.setMocRequired(random.nextBoolean());
                        if (step.getMocRequired()) {
                            step.setMocNumber("MOC-" + initiative.getSiteCode() + "-" + (1000 + random.nextInt(9000)));
                        }
                    }
                    
                    if (stages.get(i).getRequiresCapex() != null && stages.get(i).getRequiresCapex()) {
                        step.setCapexRequired(random.nextBoolean());
                        if (step.getCapexRequired()) {
                            step.setCapexDetails("CAPEX approval for " + (10000 + random.nextInt(90000)) + " USD");
                        }
                    }
                    
                    workflowStepRepository.save(step);
                }
            }
            System.out.println("Initialized workflow steps for all initiatives.");
        }
    }

    private void initializeKPIs() {
        if (kpiRepository.count() == 0) {
            List<InitiativeSite> sites = siteRepository.findAll();
            Random random = new Random();
            
            String[] kpiNames = {"Total Initiatives", "Completed Initiatives", "Total Savings", "Target Achievement"};
            String[] categories = {"Initiative", "Initiative", "Financial", "Performance"};
            String[] units = {"Count", "Count", "USD", "Percentage"};

            for (InitiativeSite site : sites) {
                // Create monthly KPIs for the past 6 months
                for (int month = 0; month < 6; month++) {
                    LocalDateTime date = LocalDateTime.now().minusMonths(month);
                    
                    for (int i = 0; i < kpiNames.length; i++) {
                        KPI kpi = new KPI();
                        kpi.setName(kpiNames[i]);
                        kpi.setCategory(categories[i]);
                        kpi.setSite(site.getCode());
                        kpi.setMonth(date.getMonth().toString());
                        kpi.setUnit(units[i]);
                        
                        // Set target and actual values based on KPI type
                        if (i == 0) { // Total Initiatives
                            kpi.setTargetValue(new BigDecimal(10));
                            kpi.setActualValue(new BigDecimal(5 + random.nextInt(10)));
                        } else if (i == 1) { // Completed Initiatives
                            kpi.setTargetValue(new BigDecimal(8));
                            kpi.setActualValue(new BigDecimal(2 + random.nextInt(5)));
                        } else if (i == 2) { // Total Savings
                            kpi.setTargetValue(new BigDecimal(100000));
                            kpi.setActualValue(new BigDecimal(50000.0 + random.nextDouble() * 200000.0));
                        } else { // Target Achievement
                            kpi.setTargetValue(new BigDecimal(90));
                            kpi.setActualValue(new BigDecimal(70.0 + random.nextDouble() * 30.0));
                        }
                        
                        kpi.setDescription("Monthly KPI tracking for " + site.getName());
                        kpi.setCreatedAt(date);
                        kpiRepository.save(kpi);
                    }
                }
            }
            System.out.println("Initialized KPIs for all sites.");
        }
    }
}