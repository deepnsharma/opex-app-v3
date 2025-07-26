import React, { useState, useRef, useEffect } from 'react';
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
import { initiativeAPI, workflowAPI } from '../services/api';

const WorkflowManagement = () => {
  const { toast } = useToast();
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [comment, setComment] = useState('');
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const signatureRef = useRef(null);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        setLoading(true);
        const response = await initiativeAPI.getAll();
        setInitiatives(response.data || []);
      } catch (error) {
        console.error('Error fetching initiatives:', error);
        setError('Failed to load initiatives');
      } finally {
        setLoading(false);
      }
    };

    fetchInitiatives();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PROPOSED':
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'IN_PROGRESS':
      case 'waiting':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROPOSED':
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'IN_PROGRESS':
      case 'waiting':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleApproval = async (initiativeId, action) => {
    try {
      // Find the workflow step that needs approval for this initiative
      const workflowResponse = await workflowAPI.getByInitiativeId(initiativeId);
      const pendingStep = workflowResponse.data?.find(step => step.status === 'PENDING');
      
      if (pendingStep) {
        if (action === 'approve') {
          await workflowAPI.approve(pendingStep.id, { comments: comment });
        } else {
          await workflowAPI.reject(pendingStep.id, { comments: comment });
        }
      }
      
      toast({
        title: action === 'approve' ? 'Initiative Approved!' : 'Initiative Rejected',
        description: `Initiative ${initiativeId} has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
      });

      // Refresh initiatives data
      const response = await initiativeAPI.getAll();
      setInitiatives(response.data || []);
      
    } catch (error) {
      console.error('Error processing approval:', error);
      toast({
        title: 'Error',
        description: 'Failed to process the approval. Please try again.',
        variant: 'destructive'
      });
    }

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
        {loading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
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
                        {initiatives.filter(i => i.status === 'PROPOSED').length}
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
                      <p className="text-green-600 text-sm font-medium">Approved</p>
                      <p className="text-2xl font-bold text-green-900">
                        {initiatives.filter(i => i.status === 'APPROVED').length}
                      </p>
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
                      <p className="text-orange-600 text-sm font-medium">In Progress</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {initiatives.filter(i => i.status === 'IN_PROGRESS').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Initiatives List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {initiatives.map((initiative) => (
                <Card key={initiative.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-800">{initiative.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                          {initiative.initiativeId || initiative.id} • {initiative.proposer} • {initiative.site}
                        </p>
                      </div>
                      <Badge className={getStatusColor(initiative.status)}>
                        {initiative.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="text-sm text-slate-700 line-clamp-2">{initiative.description}</p>
                      
                      {/* Basic Info Display */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-slate-800">Initiative Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Expected Savings:</span>
                            <p className="font-medium">₹{initiative.estimatedSavings?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Priority:</span>
                            <p className="font-medium">{initiative.priority || 'Medium'}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Created:</span>
                            <p className="font-medium">{initiative.proposalDate || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Category:</span>
                            <p className="font-medium">{initiative.category || 'OpEx'}</p>
                          </div>
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
                                  <p>{initiative.initiativeId || initiative.id}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Proposer:</Label>
                                  <p>{initiative.proposer}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Site:</Label>
                                  <p>{initiative.site}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Expected Savings:</Label>
                                  <p>₹{initiative.estimatedSavings?.toLocaleString() || 'N/A'}</p>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="font-medium">Description:</Label>
                                <p className="text-sm text-slate-700 mt-1">{initiative.description}</p>
                              </div>
                              
                              <div>
                                <Label className="font-medium">Comments:</Label>
                                <p className="text-sm text-slate-700 mt-1">{initiative.comments || 'No additional comments'}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {initiative.status === 'PROPOSED' && (
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default WorkflowManagement;