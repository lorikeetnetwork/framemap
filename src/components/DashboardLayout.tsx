import { useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import CreateFrameworkDialog from "@/components/CreateFrameworkDialog";
import ImportFrameworkDialog from "@/components/ImportFrameworkDialog";
import TemplateBrowserDialog from "@/components/TemplateBrowserDialog";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  showDialogs?: boolean;
}

export function DashboardLayout({ children, showDialogs = true }: DashboardLayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Network className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              Please sign in to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <DashboardSidebar
        onCreateNew={() => setCreateOpen(true)}
        onImport={() => setImportOpen(true)}
        onBrowseTemplates={() => setTemplatesOpen(true)}
      >
        {children}
      </DashboardSidebar>

      {showDialogs && (
        <>
          <CreateFrameworkDialog open={createOpen} onOpenChange={setCreateOpen} />
          <ImportFrameworkDialog open={importOpen} onOpenChange={setImportOpen} />
          <TemplateBrowserDialog open={templatesOpen} onOpenChange={setTemplatesOpen} />
        </>
      )}
    </>
  );
}

export default DashboardLayout;
