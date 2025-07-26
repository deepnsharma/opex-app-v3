package com.opex.service;

import com.opex.model.Project;
import com.opex.model.Task;
import com.opex.repository.ProjectRepository;
import com.opex.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }

    public Optional<Project> findByProjectId(String projectId) {
        return projectRepository.findByProjectId(projectId);
    }

    public List<Project> findByInitiativeId(Long initiativeId) {
        return projectRepository.findByInitiativeId(initiativeId);
    }

    public Project save(Project project) {
        if (project.getProjectId() == null) {
            project.setProjectId("PRJ-" + String.format("%03d", (int)(Math.random() * 1000)));
        }
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public List<Task> findTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task saveTask(Task task) {
        if (task.getTaskId() == null) {
            task.setTaskId("T" + String.format("%03d", (int)(Math.random() * 1000)));
        }
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Optional<Task> findTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Long countTasksByStatus(String status) {
        return taskRepository.countByStatus(status);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}