import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, LogIn } from 'lucide-react';

const UserMenu = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Button variant="outline" size="sm" className="border-tree-line" disabled>
        <User className="w-4 h-4" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/auth')}
        className="border-tree-line hover:bg-tree-node-hover hover:text-primary"
      >
        <LogIn className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Sign In</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-tree-line hover:bg-tree-node-hover hover:text-primary"
        >
          <User className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline max-w-24 truncate">
            {user.email?.split('@')[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-tree-line">
        <DropdownMenuItem className="text-muted-foreground text-sm cursor-default focus:bg-transparent">
          {user.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-tree-line" />
        <DropdownMenuItem
          onClick={signOut}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
