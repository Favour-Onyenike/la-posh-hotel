
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const AdminLoginLink = () => {
  return (
    <Link to="/admin/auth" className="ml-auto">
      <Button variant="outline" size="sm" className="text-xs">
        <Lock className="mr-1 h-3 w-3" />
        Admin
      </Button>
    </Link>
  );
};

export default AdminLoginLink;
