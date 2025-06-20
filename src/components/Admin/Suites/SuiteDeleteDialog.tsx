
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Room } from '@/types/supabase';

interface SuiteDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  suite: Room | null;
  onConfirm: () => void;
}

const SuiteDeleteDialog: React.FC<SuiteDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  suite,
  onConfirm,
}) => {
  if (!suite) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Suite</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{suite.name}"? This action cannot be undone, and any associated bookings may be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuiteDeleteDialog;
