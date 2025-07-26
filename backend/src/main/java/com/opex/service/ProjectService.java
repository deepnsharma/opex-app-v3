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
        return projectRepository.findByInitiative_Id(initiativeId);
    }

    public Project save(Project project) {
        if (project.getProjectId() == null) {
            project.setProjectId("PRJ-" + String.format("%03d", (int)(Math.random() * 1000)));
        }
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    // Task methods
    public List<Task> findTasksByProjectId(Long projectId) {
        return taskRepository.findByProject_Id(projectId);
    }

    public Optional<Task> findTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    public Task saveTask(Task task) {
        if (task.getTaskId() == null) {
            task.setTaskId("TSK-" + String.format("%03d", (int)(Math.random() * 1000)));
        }
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public Long countTasksByStatus(String status) {
        return taskRepository.countByStatus(status);
    }
}