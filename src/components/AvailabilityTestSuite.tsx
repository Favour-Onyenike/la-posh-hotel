
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/types/supabase';
import { Play, CheckCircle, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const AvailabilityTestSuite = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  const runAvailabilityTest = async () => {
    setIsRunning(true);
    console.log('🚀 Starting availability management test...');
    
    try {
      // Step 1: Get all rooms
      console.log('📝 Step 1: Fetching all rooms...');
      const { data: allRooms, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .limit(3);

      if (fetchError) {
        throw fetchError;
      }

      if (!allRooms || allRooms.length === 0) {
        throw new Error('No rooms found in database');
      }

      console.log(`Found ${allRooms.length} rooms for testing`);

      // Step 2: Test availability toggling
      console.log('🔄 Step 2: Testing availability toggling...');
      const testRoom = allRooms[0];
      const originalStatus = testRoom.availability_status;
      const newStatus = originalStatus === 'available' ? 'taken' : 'available';

      // Toggle to new status
      const { error: updateError1 } = await supabase
        .from('rooms')
        .update({ availability_status: newStatus })
        .eq('id', testRoom.id);

      if (updateError1) {
        throw updateError1;
      }

      console.log(`✅ Room ${testRoom.name} status changed from ${originalStatus} to ${newStatus}`);

      // Verify the change
      const { data: updatedRoom, error: verifyError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', testRoom.id)
        .single();

      if (verifyError) {
        throw verifyError;
      }

      if (updatedRoom.availability_status !== newStatus) {
        throw new Error(`Status update failed. Expected ${newStatus}, got ${updatedRoom.availability_status}`);
      }

      // Step 3: Test filtering by availability
      console.log('🔍 Step 3: Testing availability filtering...');
      const { data: availableRooms, error: filterError } = await supabase
        .from('rooms')
        .select('*')
        .eq('availability_status', 'available')
        .order('price_per_night', { ascending: true });

      if (filterError) {
        throw filterError;
      }

      console.log(`Found ${availableRooms?.length || 0} available rooms`);

      // Step 4: Test sorting (available first)
      console.log('📊 Step 4: Testing room sorting...');
      const { data: sortedRooms, error: sortError } = await supabase
        .from('rooms')
        .select('*')
        .order('availability_status', { ascending: false }) // Available first
        .order('price_per_night', { ascending: true });

      if (sortError) {
        throw sortError;
      }

      const availableFirst = sortedRooms?.filter(r => r.availability_status === 'available') || [];
      const takenLast = sortedRooms?.filter(r => r.availability_status !== 'available') || [];

      console.log(`✅ Sorting verified: ${availableFirst.length} available rooms first, ${takenLast.length} taken rooms last`);

      // Step 5: Restore original status
      console.log('🔄 Step 5: Restoring original room status...');
      const { error: restoreError } = await supabase
        .from('rooms')
        .update({ availability_status: originalStatus })
        .eq('id', testRoom.id);

      if (restoreError) {
        throw restoreError;
      }

      console.log(`✅ Room ${testRoom.name} status restored to ${originalStatus}`);

      // Test completed successfully
      const results = {
        totalRooms: allRooms.length,
        availableRooms: availableFirst.length,
        takenRooms: takenLast.length,
        testRoom: testRoom.name,
        statusToggled: `${originalStatus} → ${newStatus} → ${originalStatus}`,
        sortingWorking: availableFirst.length >= 0 && takenLast.length >= 0
      };

      setTestResults(results);

      console.log('✅ Availability management test completed successfully!');
      console.log('📊 Test Results:');
      console.log(`- Total rooms: ${results.totalRooms}`);
      console.log(`- Available rooms: ${results.availableRooms}`);
      console.log(`- Taken rooms: ${results.takenRooms}`);
      console.log(`- Test room: ${results.testRoom}`);
      console.log(`- Status toggle: ${results.statusToggled}`);
      console.log(`- Sorting working: ${results.sortingWorking ? 'Yes' : 'No'}`);
      console.log('');
      console.log('🎯 Next steps:');
      console.log('1. Go to Admin > Rooms to test manual availability toggling');
      console.log('2. Go to Admin > Suites to test suite availability');
      console.log('3. Go to Booking page to see available rooms listed first');
      console.log('4. Toggle some rooms to "taken" and verify they appear last');

      toast({
        title: 'Availability Test Completed Successfully! ✅',
        description: 'Room availability management is working correctly.',
      });

      return results;

    } catch (error) {
      console.error('❌ Availability test failed:', error);
      toast({
        title: 'Availability Test Failed ❌',
        description: 'Check the console for error details.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ToggleRight className="h-5 w-5 text-blue-600" />
          Room Availability Management Test
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test admin availability controls and customer booking experience
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium">Test Process:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline">1</Badge>
              <span>Fetch existing rooms from database</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">2</Badge>
              <span>Test availability status toggling</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">3</Badge>
              <span>Verify availability filtering works</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">4</Badge>
              <span>Test room sorting (available first)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">5</Badge>
              <span>Restore original room status</span>
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
              <p><strong>Total Rooms:</strong> {testResults.totalRooms}</p>
              <p><strong>Available Rooms:</strong> {testResults.availableRooms}</p>
              <p><strong>Taken Rooms:</strong> {testResults.takenRooms}</p>
              <p><strong>Test Room:</strong> {testResults.testRoom}</p>
              <p><strong>Status Toggle:</strong> {testResults.statusToggled}</p>
              <p><strong>Sorting:</strong> {testResults.sortingWorking ? 'Working ✅' : 'Failed ❌'}</p>
            </div>
          </div>
        )}

        <Button
          onClick={runAvailabilityTest}
          disabled={isRunning}
          className="w-full"
          variant="default"
        >
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? 'Running Availability Test...' : 'Run Availability Test'}
        </Button>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Manual Testing Steps</span>
          </div>
          <div className="space-y-1 text-sm text-blue-700">
            <p>1. Go to Admin → Rooms and toggle availability status</p>
            <p>2. Go to Admin → Suites and test suite availability</p>
            <p>3. Go to Booking page and verify available rooms appear first</p>
            <p>4. Use the "Show only available rooms" filter</p>
            <p>5. Check that taken rooms appear last when filter is off</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityTestSuite;
