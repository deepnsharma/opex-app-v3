import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  MessageSquare,
  PenTool,
  Send,
  Eye,
  ChevronRight
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { useToast } from '../hooks/use-toast';
import { mockInitiatives } from '../data/mockData';

const WorkflowManagement = () => {
  const { toast } = useToast();
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [comment, setComment] = useState('');
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const signatureRef = useRef(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'waiting':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'waiting':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleApproval = async (initiativeId, action) => {
    // Simulate approval process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: action === 'approve' ? 'Initiative Approved!' : 'Initiative Rejected',
      description: `Initiative ${initiativeId} has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
    });

    setComment('');
    setSelectedInitiative(null);
  };

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const saveSignature = () => {
    if (signatureRef.current.isEmpty()) {
      toast({
        title: 'Signature Required',
        description: 'Please provide your digital signature.',
        variant: 'destructive'
      });
      return;
    }

    const signatureData = signatureRef.current.toDataURL();
    console.log('Signature saved:', signatureData);
    
    toast({
      title: 'Signature Captured',
      description: 'Your digital signature has been saved.',
    });
    
    setSignatureDialogOpen(false);
  };

  return (
    <Layout title="Workflow Management">
      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-blue-600 text-sm font-medium">Pending Approvals</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {mockInitiatives.filter(i => i.workflow.some(w => w.status === 'pending')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-green-600 text-sm font-medium">Completed This Week</p>
                  <p className="text-2xl font-bold text-green-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-orange-600 text-sm font-medium">Overdue Reviews</p>
                  <p className="text-2xl font-bold text-orange-900">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Initiatives List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockInitiatives.map((initiative) => (
            <Card key={initiative.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">{initiative.title}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      {initiative.id} • {initiative.initiator} • {initiative.site}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(initiative.workflow[initiative.currentStage - 1]?.status)} border`}>
                    {initiative.stage}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-slate-700 line-clamp-2">{initiative.description}</p>
                  
                  {/* Workflow Progress */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-800">Approval Progress</h4>
                    <div className="space-y-2">
                      {initiative.workflow.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          {getStatusIcon(step.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-800">{step.stage}</span>
                              <span className="text-xs text-slate-500">{step.approver}</span>
                            </div>
                            {step.date && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span className="text-xs text-slate-500">{step.date}</span>
                              </div>
                            )}
                          </div>
                          {index < initiative.workflow.length - 1 && (
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedInitiative(initiative)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">{initiative.title}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Initiative ID:</Label>
                              <p>{initiative.id}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Initiator:</Label>
                              <p>{initiative.initiator}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Site:</Label>
                              <p>{initiative.site}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Expected Value:</Label>
                              <p>₹{initiative.expectedValue?.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="font-medium">Description:</Label>
                            <p className="text-sm text-slate-700 mt-1">{initiative.description}</p>
                          </div>
                          
                          <div>
                            <Label className="font-medium">Target Outcome:</Label>
                            <p className="text-sm text-slate-700 mt-1">{initiative.targetOutcome}</p>
                          </div>
                          
                          <div>
                            <Label className="font-medium">Key Assumptions:</Label>
                            <ul className="list-disc list-inside text-sm text-slate-700 mt-1 space-y-1">
                              {initiative.assumptions?.map((assumption, index) => (
                                <li key={index}>{assumption}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {initiative.workflow.some(w => w.status === 'pending') && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Initiative</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div>
                              <Label className="font-medium">Add Comments:</Label>
                              <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add your review comments..."
                                className="mt-2"
                              />
                            </div>
                            
                            <div className="flex space-x-2">
                              <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="flex-1">
                                    <PenTool className="mr-2 h-4 w-4" />
                                    Digital Signature
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Digital Signature</DialogTitle>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                      <SignatureCanvas
                                        ref={signatureRef}
                                        canvasProps={{
                                          width: 400,
                                          height: 200,
                                          className: 'signature-canvas border rounded'
                                        }}
                                      />
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <Button variant="outline" onClick={clearSignature} className="flex-1">
                                        Clear
                                      </Button>
                                      <Button onClick={saveSignature} className="flex-1">
                                        Save Signature
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            
                            <div className="flex space-x-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => handleApproval(initiative.id, 'reject')}
                                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleApproval(initiative.id, 'approve')}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WorkflowManagement;