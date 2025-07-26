import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Recycle, 
  Clock, 
  Leaf,
  Plus,
  Download,
  Filter,
  BarChart3
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockKPIs } from '../data/mockData';

const KPITracking = () => {
  const { toast } = useToast();
  const [selectedMetric, setSelectedMetric] = useState('costSavings');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newKPI, setNewKPI] = useState({
    month: '',
    energySavings: '',
    costSavings: '',
    productivityGain: '',
    wasteReduction: '',
    co2Reduction: '',
    cycleTimeReduction: ''
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'accepted', label: 'Accepted', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'under-approvals', label: 'Under Approvals', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'implemented', label: 'Implemented', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'validated', label: 'Validated', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 'dropped', label: 'Dropped', color: 'bg-red-100 text-red-800 border-red-200' }
  ];

  const kpiMetrics = [
    { key: 'costSavings', label: 'Cost Savings', icon: DollarSign, color: '#3B82F6', unit: '₹K' },
    { key: 'energySavings', label: 'Energy Savings', icon: Zap, color: '#F59E0B', unit: 'MWh' },
    { key: 'productivityGain', label: 'Productivity Gain', icon: TrendingUp, color: '#10B981', unit: '%' },
    { key: 'wasteReduction', label: 'Waste Reduction', icon: Recycle, color: '#8B5CF6', unit: '%' },
    { key: 'co2Reduction', label: 'CO₂ Reduction', icon: Leaf, color: '#06B6D4', unit: 'MT' },
    { key: 'cycleTimeReduction', label: 'Cycle Time Reduction', icon: Clock, color: '#EF4444', unit: '%' }
  ];

  const handleKPISubmit = () => {
    console.log('Adding new KPI data:', newKPI);
    toast({
      title: 'KPI Data Added',
      description: 'Monthly KPI data has been successfully recorded.',
    });
    
    setNewKPI({
      month: '',
      energySavings: '',
      costSavings: '',
      productivityGain: '',
      wasteReduction: '',
      co2Reduction: '',
      cycleTimeReduction: ''
    });
  };

  const exportData = (format) => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: 'Your report is being generated and will download shortly.',
    });
  };

  const chartData = mockKPIs.map(kpi => ({
    ...kpi,
    month: kpi.month.split(' ')[0],
    costSavings: kpi.costSavings / 1000,
    energySavings: kpi.energySavings / 1000
  }));

  const selectedMetricData = kpiMetrics.find(m => m.key === selectedMetric);

  return (
    <Layout title="KPI Tracking & Monthly Monitoring">
      <div className="space-y-8">
        {/* KPI Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiMetrics.map((metric) => {
            const Icon = metric.icon;
            const latestValue = mockKPIs[mockKPIs.length - 1][metric.key];
            const previousValue = mockKPIs[mockKPIs.length - 2]?.[metric.key] || 0;
            const change = latestValue - previousValue;
            const changePercent = previousValue ? ((change / previousValue) * 100).toFixed(1) : 0;

            return (
              <Card key={metric.key} className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}20` }}>
                      <Icon className="h-6 w-6" style={{ color: metric.color }} />
                    </div>
                    <Badge className={change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {change >= 0 ? '+' : ''}{changePercent}%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold" style={{ color: metric.color }}>
                      {metric.key === 'costSavings' || metric.key === 'energySavings' 
                        ? (latestValue / 1000).toFixed(1) 
                        : latestValue.toFixed(1)
                      } {metric.unit}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      vs last month: {change >= 0 ? '+' : ''}{change.toFixed(1)} {metric.unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <span>Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Metric</Label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kpiMetrics.map((metric) => (
                      <SelectItem key={metric.key} value={metric.key}>
                        {metric.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Status Filter</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label className="text-sm font-medium">Export Reports</Label>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => exportData('pdf')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    PDF Report
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => exportData('excel')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Excel Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6" style={{ color: selectedMetricData?.color }} />
                <span>{selectedMetricData?.label} Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedMetricData?.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={selectedMetricData?.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      `${value} ${selectedMetricData?.unit}`, 
                      selectedMetricData?.label
                    ]} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke={selectedMetricData?.color} 
                    fillOpacity={1} 
                    fill={`url(#gradient-${selectedMetric})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Status Categories and Financial Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Initiative Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((status) => (
                  <div key={status.value} className="flex items-center justify-between p-3 rounded-lg border">
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                    <span className="text-sm font-medium">
                      {Math.floor(Math.random() * 10) + 1}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Metrics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Financial Metrics</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Monthly KPI Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Month</Label>
                        <Input
                          type="month"
                          value={newKPI.month}
                          onChange={(e) => setNewKPI({...newKPI, month: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Cost Savings (₹)</Label>
                        <Input
                          type="number"
                          value={newKPI.costSavings}
                          onChange={(e) => setNewKPI({...newKPI, costSavings: e.target.value})}
                          placeholder="Amount in rupees"
                        />
                      </div>
                      <div>
                        <Label>Energy Savings (MWh)</Label>
                        <Input
                          type="number"
                          value={newKPI.energySavings}
                          onChange={(e) => setNewKPI({...newKPI, energySavings: e.target.value})}
                          placeholder="Energy saved"
                        />
                      </div>
                      <div>
                        <Label>Productivity Gain (%)</Label>
                        <Input
                          type="number"
                          value={newKPI.productivityGain}
                          onChange={(e) => setNewKPI({...newKPI, productivityGain: e.target.value})}
                          placeholder="Percentage gain"
                        />
                      </div>
                      <div>
                        <Label>Waste Reduction (%)</Label>
                        <Input
                          type="number"
                          value={newKPI.wasteReduction}
                          onChange={(e) => setNewKPI({...newKPI, wasteReduction: e.target.value})}
                          placeholder="Percentage reduction"
                        />
                      </div>
                      <div>
                        <Label>CO₂ Reduction (MT)</Label>
                        <Input
                          type="number"
                          value={newKPI.co2Reduction}
                          onChange={(e) => setNewKPI({...newKPI, co2Reduction: e.target.value})}
                          placeholder="Metric tons"
                        />
                      </div>
                    </div>
                    <Button onClick={handleKPISubmit} className="w-full">
                      Add KPI Data
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="text-sm font-medium text-green-800">Estimated Annual Savings</p>
                    <p className="text-2xl font-bold text-green-900">₹24.5L</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800">Budgeted Savings</p>
                    <p className="text-lg font-bold text-blue-900">₹18.2L</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-800">Non-budgeted</p>
                    <p className="text-lg font-bold text-orange-900">₹6.3L</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Total CAPEX</p>
                      <p className="text-xl font-bold text-purple-900">₹12.8L</p>
                    </div>
                    <p className="text-sm text-purple-700">ROI: 91%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed KPI Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly KPI Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="productivityGain" fill="#10B981" name="Productivity %" />
                <Bar dataKey="wasteReduction" fill="#8B5CF6" name="Waste Reduction %" />
                <Bar dataKey="cycleTimeReduction" fill="#EF4444" name="Cycle Time %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default KPITracking;