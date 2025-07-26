import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Calendar, CalendarIcon, Upload, X, FileText, Save, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const InitiativeForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    initiator: '',
    site: '',
    date: '',
    description: '',
    baselineData: '',
    targetOutcome: '',
    expectedValue: '',
    confidence: [75],
    assumptions: ['', '', ''],
    estimatedCapex: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssumptionChange = (index, value) => {
    const newAssumptions = [...formData.assumptions];
    newAssumptions[index] = value;
    setFormData(prev => ({ ...prev, assumptions: newAssumptions }));
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e, action = 'draft') => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const initiativeData = {
      ...formData,
      confidence: formData.confidence[0],
      attachments: files.map(f => f.name),
      status: action === 'submit' ? 'Submitted' : 'Draft',
      dateCreated: new Date().toISOString().split('T')[0],
      id: 'INI-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    };

    console.log('Initiative Data:', initiativeData);

    toast({
      title: action === 'submit' ? "Initiative Submitted!" : "Draft Saved!",
      description: action === 'submit' 
        ? "Your initiative has been submitted for review."
        : "Your initiative has been saved as draft.",
    });

    setLoading(false);
    
    if (action === 'submit') {
      navigate('/workflow');
    }
  };

  return (
    <Layout title="Submit New Initiative">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">New OpEx Initiative</CardTitle>
            <p className="text-blue-100">Complete all sections to submit your operational excellence initiative</p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={(e) => handleSubmit(e, 'submit')} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-700 font-medium">Initiative Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter initiative title"
                      className="h-12 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="initiator" className="text-slate-700 font-medium">Initiator Name *</Label>
                    <Input
                      id="initiator"
                      value={formData.initiator}
                      onChange={(e) => handleInputChange('initiator', e.target.value)}
                      placeholder="Enter your name"
                      className="h-12 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site" className="text-slate-700 font-medium">Site *</Label>
                    <Select onValueChange={(value) => handleInputChange('site', value)}>
                      <SelectTrigger className="h-12 border-slate-300">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plant-a">Manufacturing Plant A</SelectItem>
                        <SelectItem value="plant-b">Manufacturing Plant B</SelectItem>
                        <SelectItem value="plant-c">Manufacturing Plant C</SelectItem>
                        <SelectItem value="warehouse-1">Distribution Center 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-slate-700 font-medium">Initiative Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="h-12 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700 font-medium">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a detailed description of the initiative..."
                    className="min-h-32 border-slate-300 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Baseline & Target Data */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">
                  Baseline & Target Data
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="baseline" className="text-slate-700 font-medium">Baseline Data (12-month historical) *</Label>
                    <Textarea
                      id="baseline"
                      value={formData.baselineData}
                      onChange={(e) => handleInputChange('baselineData', e.target.value)}
                      placeholder="Enter 12-month historical data and metrics..."
                      className="min-h-24 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target" className="text-slate-700 font-medium">Target Outcome *</Label>
                    <Textarea
                      id="target"
                      value={formData.targetOutcome}
                      onChange={(e) => handleInputChange('targetOutcome', e.target.value)}
                      placeholder="Describe expected outcomes and targets..."
                      className="min-h-24 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">
                  Financial Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedValue" className="text-slate-700 font-medium">Expected Value (₹) *</Label>
                    <Input
                      id="expectedValue"
                      type="number"
                      value={formData.expectedValue}
                      onChange={(e) => handleInputChange('expectedValue', e.target.value)}
                      placeholder="Expected financial benefit"
                      className="h-12 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capex" className="text-slate-700 font-medium">Estimated CAPEX (₹)</Label>
                    <Input
                      id="capex"
                      type="number"
                      value={formData.estimatedCapex}
                      onChange={(e) => handleInputChange('estimatedCapex', e.target.value)}
                      placeholder="Capital expenditure required"
                      className="h-12 border-slate-300 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-slate-700 font-medium">Confidence Level: {formData.confidence[0]}%</Label>
                  <div className="px-4">
                    <Slider
                      value={formData.confidence}
                      onValueChange={(value) => handleInputChange('confidence', value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0% - Low</span>
                      <span>50% - Medium</span>
                      <span>100% - High</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Assumptions */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">
                  Key Assumptions
                </h3>
                
                <div className="space-y-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-slate-700 font-medium">Assumption {index + 1} *</Label>
                      <Input
                        value={formData.assumptions[index]}
                        onChange={(e) => handleAssumptionChange(index, e.target.value)}
                        placeholder={`Enter key assumption ${index + 1}...`}
                        className="h-12 border-slate-300 focus:border-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* File Attachments */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">
                  Supporting Documents
                </h3>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <p className="text-slate-600 mb-2">Drag and drop files here, or click to browse</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload').click()}
                      className="mt-2"
                    >
                      Browse Files
                    </Button>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Attached Files:</Label>
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">{file.name}</p>
                              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={loading}
                  className="flex-1 h-12 text-slate-700 border-slate-300 hover:bg-slate-50"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save as Draft
                </Button>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {loading ? 'Submitting...' : 'Submit Initiative'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default InitiativeForm;