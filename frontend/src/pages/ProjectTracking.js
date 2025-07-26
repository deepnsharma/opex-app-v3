import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Plus, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Edit,
  Save,
  FolderKanban,
  Users,
  Target
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockProjects } from '../data/mockData';

const ProjectTracking = () => {
  const { toast } = useToast();
  const [projects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    progress: 0,
    owner: '',
    comments: ''
  });

  const statusColors = {
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Planning': 'bg-orange-100 text-orange-800 border-orange-200',
    'On Hold': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Planning':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleTaskUpdate = (taskId, updates) => {
    // Simulate task update
    console.log('Updating task:', taskId, updates);
    toast({
      title: 'Task Updated',
      description: 'Task has been successfully updated.',
    });
    setEditingTask(null);
  };

  const handleAddTask = () => {
    // Simulate adding new task
    console.log('Adding new task:', newTask);
    toast({
      title: 'Task Added',
      description: 'New task has been added to the project.',
    });
    setNewTask({
      name: '',
      startDate: '',
      endDate: '',
      status: 'Planning',
      progress: 0,
      owner: '',
      comments: ''
    });
  };

  const raciOptions = ['Responsible', 'Accountable', 'Consulted', 'Informed'];

  return (
    <Layout title="Project Tracking & RACI Matrix">
      <div className="space-y-8">
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FolderKanban className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-blue-600 text-sm font-medium">Active Projects</p>
                  <p className="text-2xl font-bold text-blue-900">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-green-600 text-sm font-medium">Completed Tasks</p>
                  <p className="text-2xl font-bold text-green-900">
                    {selectedProject?.tasks.filter(t => t.status === 'Completed').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-orange-600 text-sm font-medium">In Progress</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {selectedProject?.tasks.filter(t => t.status === 'In Progress').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-purple-600 text-sm font-medium">Overall Progress</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {selectedProject?.tasks ? 
                      Math.round(selectedProject.tasks.reduce((acc, task) => acc + task.progress, 0) / selectedProject.tasks.length) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderKanban className="h-6 w-6 text-blue-600" />
              <span>Project Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedProject(projects.find(p => p.id === value))}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.initiativeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedProject && (
          <>
            {/* RACI Matrix */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-green-600" />
                  <span>RACI Matrix - {selectedProject.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">Role</TableHead>
                        <TableHead>Responsible</TableHead>
                        <TableHead>Accountable</TableHead>
                        <TableHead>Consulted</TableHead>
                        <TableHead>Informed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProject.raci?.map((role, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{role.role}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {role.responsible}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {role.accountable}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              {role.consulted}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {role.informed}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Task Timeline Management */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <span>Task Timeline Management</span>
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Task Name</Label>
                          <Input
                            value={newTask.name}
                            onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                            placeholder="Enter task name"
                          />
                        </div>
                        <div>
                          <Label>Owner</Label>
                          <Input
                            value={newTask.owner}
                            onChange={(e) => setNewTask({...newTask, owner: e.target.value})}
                            placeholder="Task owner"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={newTask.startDate}
                            onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={newTask.endDate}
                            onChange={(e) => setNewTask({...newTask, endDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select onValueChange={(value) => setNewTask({...newTask, status: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Planning">Planning</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="On Hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Progress (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={newTask.progress}
                            onChange={(e) => setNewTask({...newTask, progress: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Comments</Label>
                        <Textarea
                          value={newTask.comments}
                          onChange={(e) => setNewTask({...newTask, comments: e.target.value})}
                          placeholder="Add any comments or notes..."
                        />
                      </div>
                      <Button onClick={handleAddTask} className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Add Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProject.tasks?.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.name}</TableCell>
                          <TableCell>{task.startDate}</TableCell>
                          <TableCell>{task.endDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(task.status)}
                              <Badge className={statusColors[task.status] || statusColors['Planning']}>
                                {task.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Progress value={task.progress} className="w-20" />
                              <span className="text-xs text-slate-600">{task.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-slate-400" />
                              <span className="text-sm">{task.owner}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-48">
                            <p className="text-sm text-slate-600 truncate">{task.comments}</p>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingTask(task)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Task</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Progress (%)</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        defaultValue={task.progress}
                                        placeholder="Progress percentage"
                                      />
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <Select defaultValue={task.status}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Planning">Planning</SelectItem>
                                          <SelectItem value="In Progress">In Progress</SelectItem>
                                          <SelectItem value="Completed">Completed</SelectItem>
                                          <SelectItem value="On Hold">On Hold</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Comments</Label>
                                    <Textarea
                                      defaultValue={task.comments}
                                      placeholder="Update comments..."
                                    />
                                  </div>
                                  <Button 
                                    onClick={() => handleTaskUpdate(task.id, {})} 
                                    className="w-full"
                                  >
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Task
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProjectTracking;