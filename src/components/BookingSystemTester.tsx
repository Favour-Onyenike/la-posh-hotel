
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  runBookingSystemTest, 
  cleanupTestData 
} from '@/utils/testBookingSystem';
import { Play, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const BookingSystemTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  const handleRunTest = async () => {
    setIsRunning(true);
    try {
      const results = await runBookingSystemTest();
      if (results) {
        setTestResults(results);
        toast({
          title: 'Test Completed Successfully! ✅',
          description: 'Check the console for detailed results and next steps.',
        });
      } else {
        toast({
          title: 'Test Failed ❌',
          description: 'Check the console for error details.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Test execution error:', error);
      toast({
        title: 'Test Error ❌',
        description: 'An unexpected error occurred during testing.',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCleanup = async () => {
    setIsCleaning(true);
    try {
      await cleanupTestData();
      setTestResults(null);
      toast({
        title: 'Cleanup Completed 🧹',
        description: 'All test data has been removed.',
      });
    } catch (error) {
      console.error('Cleanup error:', error);
      toast({
        title: 'Cleanup Error ❌',
        description: 'Error occurred during cleanup.',
        variant: 'destructive',
      });
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Booking System Test Suite
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the complete booking flow from room creation to admin management
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium">Test Process:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline">1</Badge>
              <span>Create a test suite room</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">2</Badge>
              <span>Check room availability function</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">3</Badge>
              <span>Create a test booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">4</Badge>
              <span>Verify data appears in admin dashboard</span>
            </div>
          </div>
        </div>

        {testResults && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Test Results</span>
            </div>
            <div className="space-y-1 text-sm text-green-700">
              <p><strong>Room:</strong> {testResults.room?.name} ({testResults.room?.room_number})</p>
              <p><strong>Booking:</strong> {testResults.booking?.guest_name}</p>
              <p><strong>Dates:</strong> {testResults.booking?.check_in_date} to {testResults.booking?.check_out_date}</p>
              <p><strong>Total:</strong> ₦{testResults.booking?.total_price?.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleRunTest}
            disabled={isRunning}
            className="flex-1"
            variant="default"
          >
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? 'Running Test...' : 'Run Booking Test'}
          </Button>
          
          {testResults && (
            <Button
              onClick={handleCleanup}
              disabled={isCleaning}
              variant="outline"
              className="flex-1"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isCleaning ? 'Cleaning...' : 'Cleanup Test Data'}
            </Button>
          )}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Next Steps After Test</span>
          </div>
          <div className="space-y-1 text-sm text-blue-700">
            <p>1. Check Admin Dashboard for updated stats</p>
            <p>2. Go to Admin → Bookings to see the test booking</p>
            <p>3. Go to Admin → Rooms to see the test room</p>
            <p>4. Try booking the test room from the public booking page</p>
            <p>5. Test status updates and booking management</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSystemTester;
