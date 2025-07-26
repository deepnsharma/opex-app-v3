package com.opex.controller;

import com.opex.model.Project;
import com.opex.model.Task;
import com.opex.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.findById(id);
        return project.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project-id/{projectId}")
    public ResponseEntity<Project> getProjectByProjectId(@PathVariable String projectId) {
        Optional<Project> project = projectService.findByProjectId(projectId);
        return project.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/initiative/{initiativeId}")
    public List<Project> getProjectsByInitiativeId(@PathVariable Long initiativeId) {
        return projectService.findByInitiativeId(initiativeId);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        try {
            Project savedProject = projectService.save(project);
            return ResponseEntity.ok(savedProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        Optional<Project> existingProject = projectService.findById(id);
        if (existingProject.isPresent()) {
            project.setId(id);
            Project updated = projectService.save(project);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }

    // Task endpoints
    @GetMapping("/{projectId}/tasks")
    public List<Task> getTasksByProjectId(@PathVariable Long projectId) {
        return projectService.findTasksByProjectId(projectId);
    }

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<Task> createTask(@PathVariable Long projectId, @RequestBody Task task) {
        try {
            Optional<Project> project = projectService.findById(projectId);
            if (project.isPresent()) {
                task.setProject(project.get());
                Task savedTask = projectService.saveTask(task);
                return ResponseEntity.ok(savedTask);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task task) {
        Optional<Task> existingTask = projectService.findTaskById(taskId);
        if (existingTask.isPresent()) {
            task.setId(taskId);
            task.setProject(existingTask.get().getProject());
            Task updated = projectService.saveTask(task);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        projectService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tasks/stats/count/{status}")
    public ResponseEntity<Long> getTaskCountByStatus(@PathVariable String status) {
        return ResponseEntity.ok(projectService.countTasksByStatus(status));
    }
}