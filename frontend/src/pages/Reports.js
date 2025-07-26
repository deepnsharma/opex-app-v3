import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Search,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockInitiatives, mockKPIs, mockDashboardData } from '../data/mockData';

const Reports = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [reportType, setReportType] = useState('summary');
  const [siteFilter, setSiteFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const reportTypes = [
    { value: 'summary', label: 'Executive Summary' },
    { value: 'detailed', label: 'Detailed Performance' },
    { value: 'financial', label: 'Financial Impact' },
    { value: 'kpi', label: 'KPI Analysis' },
    { value: 'closure', label: 'Closure Report' }
  ];

  const exportFormats = [
    { value: 'pdf', label: 'PDF Report', icon: FileText },
    { value: 'excel', label: 'Excel Workbook', icon: FileText },
    { value: 'csv', label: 'CSV Data', icon: FileText }
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const handleExport = (format) => {
    toast({
      title: `Exporting ${format.toUpperCase()} Report`,
      description: 'Your report is being generated and will download shortly.',
    });
  };

  const generateReport = () => {
    toast({
      title: 'Generating Report',
      description: 'Please wait while we compile your custom report.',
    });
  };

  const initiativesByStatus = mockInitiatives.reduce((acc, initiative) => {
    acc[initiative.status] = (acc[initiative.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(initiativesByStatus).map(([status, count], index) => ({
    name: status,
    value: count,
    color: colors[index % colors.length]
  }));

  const monthlyData = mockKPIs.map(kpi => ({
    month: kpi.month.split(' ')[0],
    savings: kpi.costSavings / 1000,
    energy: kpi.energySavings / 1000,
    productivity: kpi.productivityGain,
    initiatives: Math.floor(Math.random() * 5) + 3
  }));

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Pending': 'bg-orange-100 text-orange-800 border-orange-200',
      'Closed': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Layout title="Reports & Analytics">
      <div className="space-y-8">
        {/* Report Configuration */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>Report Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Site Filter</Label>
                <Select value={siteFilter} onValueChange={setSiteFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    <SelectItem value="plant-a">Plant A</SelectItem>
                    <SelectItem value="plant-b">Plant B</SelectItem>
                    <SelectItem value="plant-c">Plant C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">From Date</Label>
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">To Date</Label>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
              <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <Button 
                    key={format.value}
                    variant="outline" 
                    onClick={() => handleExport(format.value)}
                    className="hover:bg-slate-50"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {format.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Monthly Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={3} name="Savings (₹K)" />
                  <Line type="monotone" dataKey="productivity" stroke="#10B981" strokeWidth={3} name="Productivity %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
                <span>Initiative Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparative Analysis */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>Site Performance Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="savings" fill="#3B82F6" name="Savings (₹K)" />
                <Bar dataKey="initiatives" fill="#10B981" name="Initiatives" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Initiative Table */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span>Detailed Initiative Report</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search initiatives..." 
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Initiative ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Initiator</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected Value</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Date Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInitiatives.map((initiative) => (
                    <TableRow key={initiative.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{initiative.id}</TableCell>
                      <TableCell className="max-w-48">
                        <div className="truncate">{initiative.title}</div>
                      </TableCell>
                      <TableCell>{initiative.initiator}</TableCell>
                      <TableCell>{initiative.site}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(initiative.status)}>
                          {initiative.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{initiative.expectedValue?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(initiative.currentStage / 4) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-600">
                            {Math.round((initiative.currentStage / 4) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{initiative.dateCreated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-blue-900">₹{(mockDashboardData.totalSavings / 100000).toFixed(1)}L</p>
              <p className="text-sm text-blue-600 font-medium">Total Savings YTD</p>
              <p className="text-xs text-blue-500 mt-1">+12% vs target</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-green-900">{mockDashboardData.completionRate}%</p>
              <p className="text-sm text-green-600 font-medium">On-time Completion</p>
              <p className="text-xs text-green-500 mt-1">Above industry avg</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-orange-900">{mockDashboardData.totalInitiatives}</p>
              <p className="text-sm text-orange-600 font-medium">Active Initiatives</p>
              <p className="text-xs text-orange-500 mt-1">3 added this week</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-purple-900">18</p>
              <p className="text-sm text-purple-600 font-medium">Closed This Month</p>
              <p className="text-xs text-purple-500 mt-1">2 ahead of schedule</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;