import { useNavigate } from "react-router-dom";
import { 
  Network, 
  LayoutGrid, 
  Clock,
  FolderOpen,
  Plus,
  FileText,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import { useFrameworkMaps } from "@/hooks/useFrameworkMaps";
import { formatDistanceToNow } from "date-fns";

const Index = () => {
  const { maps, loading } = useFrameworkMaps();
  const navigate = useNavigate();

  // Get recent frameworks (last 6)
  const recentMaps = maps.slice(0, 6);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Framework Builder</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage visual frameworks for your business ideas, projects, and strategies
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Frameworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? '-' : maps.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Templates Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">27</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate("/frameworks")}>
                <FolderOpen className="w-4 h-4 mr-1" />
                Browse
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Frameworks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Frameworks</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/frameworks")}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentMaps.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">No frameworks yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Get started by creating a new framework or browsing templates
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentMaps.map((map) => (
                <Card 
                  key={map.id} 
                  className="group overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/frameworks/${map.id}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg truncate">{map.name}</CardTitle>
                    {map.description && (
                      <CardDescription className="line-clamp-1">
                        {map.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(map.updated_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/frameworks/${map.id}`);
                          }}
                        >
                          <Network className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/frameworks/${map.id}/canvas`);
                          }}
                        >
                          <LayoutGrid className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Getting Started */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Plus className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-base">Create New</CardTitle>
                <CardDescription>
                  Start with a blank framework and build your structure from scratch
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <FileText className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-base">Use Template</CardTitle>
                <CardDescription>
                  Choose from 27 strategy frameworks like McKinsey 7-S, Porter's Five Forces
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Upload className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-base">Import JSON</CardTitle>
                <CardDescription>
                  Import existing framework data from a JSON file
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
