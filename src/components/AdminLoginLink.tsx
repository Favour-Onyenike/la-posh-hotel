
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const AdminLoginLink = () => {
  return (
    <Link to="/admin/login" className="ml-auto">
      <Button variant="outline" size="icon" className="h-8 w-8">
        <Lock className="h-4 w-4" />
      </Button>
    </Link>
  );
};

export default AdminLoginLink;
