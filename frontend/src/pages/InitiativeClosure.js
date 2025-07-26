import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  FileX, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  MessageSquare,
  PenTool,
  Send,
  TrendingUp,
  DollarSign,
  Target,
  Users
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { useToast } from '../hooks/use-toast';
import { mockClosureData } from '../data/mockData';

const InitiativeClosure = () => {
  const { toast } = useToast();
  const [closures] = useState(mockClosureData);
  const [selectedClosure, setSelectedClosure] = useState(closures[0]);
  const [newComment, setNewComment] = useState('');
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const signatureRef = useRef(null);

  const getStageIcon = (status) => {
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

  const getStageColor = (status) => {
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

  const handleStageAction = async (action) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: action === 'approve' ? 'Stage Approved!' : 'Stage Rejected',
      description: `Closure process has been ${action === 'approve' ? 'moved to next stage' : 'rejected'}.`,
    });
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    
    console.log('Adding comment:', newComment);
    toast({
      title: 'Comment Added',
      description: 'Your comment has been added to the closure process.',
    });
    setNewComment('');
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

  const completionPercentage = selectedClosure ? 
    (selectedClosure.actualValue / selectedClosure.targetValue) * 100 : 0;

  return (
    <Layout title="Initiative Closure Management">
      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FileX className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-purple-600 text-sm font-medium">Ready for Closure</p>
                  <p className="text-2xl font-bold text-purple-900">{closures.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-green-600 text-sm font-medium">Completed This Month</p>
                  <p className="text-2xl font-bold text-green-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Value Realized</p>
                  <p className="text-2xl font-bold text-blue-900">₹45.2L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-orange-600 text-sm font-medium">Average Target Achievement</p>
                  <p className="text-2xl font-bold text-orange-900">112%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Closure Details */}
        {selectedClosure && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Initiative Information */}
            <Card className="lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">{selectedClosure.initiativeName}</CardTitle>
                <p className="text-blue-100">Initiative ID: {selectedClosure.initiativeId}</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Initiative Lead</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{selectedClosure.lead}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600">CAPEX Summary</Label>
                      <p className="text-lg font-bold text-slate-900 mt-1">₹{selectedClosure.capexSummary?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Performance Comparison */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 border-b pb-2">Performance vs Target</h4>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-600">Target Value</p>
                        <p className="text-xl font-bold text-blue-900">₹{selectedClosure.targetValue?.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-600">Actual Value</p>
                        <p className="text-xl font-bold text-green-900">₹{selectedClosure.actualValue?.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-600">Achievement</p>
                        <p className="text-xl font-bold text-purple-900">{completionPercentage.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Target Achievement Progress</span>
                        <span>{completionPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(completionPercentage, 100)} className="h-3" />
                      <p className="text-xs text-slate-600">
                        {completionPercentage > 100 ? 'Exceeded target by' : 'Achievement rate:'} {Math.abs(completionPercentage - 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Justification */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-800">Closure Justification</Label>
                    <div className="p-4 bg-slate-50 rounded-lg border">
                      <p className="text-sm text-slate-700">{selectedClosure.justification}</p>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    <Label className="font-semibold text-slate-800">Team Comments</Label>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {selectedClosure.comments?.map((comment, index) => (
                        <div key={index} className="p-3 bg-white border rounded-lg shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-800">{comment.user}</span>
                            <span className="text-xs text-slate-500">{comment.date}</span>
                          </div>
                          <p className="text-sm text-slate-700">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment..."
                        className="flex-1"
                      />
                      <Button onClick={addComment} className="px-6">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Closure Workflow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span>Closure Workflow</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedClosure.workflow?.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-3">
                        {getStageIcon(stage.status)}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-800">{stage.stage}</span>
                            <Badge className={getStageColor(stage.status)}>
                              {stage.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{stage.approver}</p>
                          {stage.date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">{stage.date}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < selectedClosure.workflow.length - 1 && (
                        <div className="ml-2.5 mt-2 w-px h-6 bg-slate-200"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                {selectedClosure.workflow?.some(stage => stage.status === 'pending') && (
                  <div className="space-y-4 pt-6 border-t mt-6">
                    <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <PenTool className="mr-2 h-4 w-4" />
                          Capture Signature
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
                            <Button variant="outline" onClick={() => signatureRef.current?.clear()} className="flex-1">
                              Clear
                            </Button>
                            <Button onClick={saveSignature} className="flex-1">
                              Save Signature
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleStageAction('reject')}
                        className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleStageAction('approve')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Closure Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Closure Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Initiative Outcomes</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Exceeded Target</span>
                    <span className="font-bold text-green-900">67%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Met Target</span>
                    <span className="font-bold text-blue-900">28%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-800">Below Target</span>
                    <span className="font-bold text-orange-900">5%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Closure Timeline</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Average Days to Close</span>
                    <span className="font-bold">18 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Fastest Closure</span>
                    <span className="font-bold text-green-600">8 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Longest Closure</span>
                    <span className="font-bold text-orange-600">45 days</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Value Impact</h4>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                    <p className="text-sm font-medium text-blue-600">Total Value Delivered</p>
                    <p className="text-2xl font-bold text-blue-900">₹156.8L</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-xs font-medium text-green-600">ROI</p>
                      <p className="text-lg font-bold text-green-900">287%</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded border border-purple-200">
                      <p className="text-xs font-medium text-purple-600">Payback</p>
                      <p className="text-lg font-bold text-purple-900">4.2M</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default InitiativeClosure;