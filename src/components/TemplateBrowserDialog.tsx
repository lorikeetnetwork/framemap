import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Loader2, 
  Search, 
  ChevronRight,
  BookOpen,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useFrameworkMaps } from "@/hooks/useFrameworkMaps";
import { 
  strategyTemplates, 
  templateCategories, 
  getTemplatesByCategory,
  StrategyTemplate 
} from "@/data/strategyTemplates";

interface TemplateBrowserDialogProps {
  trigger?: React.ReactNode;
}

const TemplateBrowserDialog = ({ trigger }: TemplateBrowserDialogProps) => {
  const navigate = useNavigate();
  const { saveMap } = useFrameworkMaps();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplate | null>(null);
  const [loading, setLoading] = useState(false);

  const groupedTemplates = getTemplatesByCategory();

  const filteredTemplates = searchTerm
    ? strategyTemplates.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  const handleUseTemplate = async (template: StrategyTemplate) => {
    setLoading(true);
    const result = await saveMap(
      template.name,
      template.framework,
      template.description
    );
    setLoading(false);
    
    if (result) {
      setOpen(false);
      setSelectedTemplate(null);
      setSearchTerm("");
      navigate(`/frameworks/${result.id}`);
    }
  };

  const TemplateCard = ({ template }: { template: StrategyTemplate }) => (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/50 ${
        selectedTemplate?.id === template.id ? 'border-primary bg-accent' : 'border-border'
      }`}
      onClick={() => setSelectedTemplate(template)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{template.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {template.description}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        setSelectedTemplate(null);
        setSearchTerm("");
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Browse Templates
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Strategy Framework Templates</DialogTitle>
          <DialogDescription>
            Choose from {strategyTemplates.length} professional strategy and diagnostic frameworks
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left panel - Template list */}
          <div className="w-1/2 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {filteredTemplates ? (
                <div className="p-4 space-y-2">
                  {filteredTemplates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No templates found for "{searchTerm}"
                    </p>
                  ) : (
                    filteredTemplates.map(template => (
                      <TemplateCard key={template.id} template={template} />
                    ))
                  )}
                </div>
              ) : (
                <Tabs defaultValue={templateCategories[0]} className="w-full">
                  <div className="px-4 pt-2">
                    <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
                      {templateCategories.map((category, idx) => (
                        <TabsTrigger 
                          key={category} 
                          value={category}
                          className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {idx + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  {templateCategories.map(category => (
                    <TabsContent key={category} value={category} className="p-4 pt-2 m-0">
                      <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {groupedTemplates[category].map(template => (
                          <TemplateCard key={template.id} template={template} />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </ScrollArea>
          </div>

          {/* Right panel - Template details */}
          <div className="w-1/2 flex flex-col">
            {selectedTemplate ? (
              <>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {selectedTemplate.category}
                      </Badge>
                      <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedTemplate.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <h4 className="font-medium text-sm">Understand</h4>
                      </div>
                      <ul className="space-y-1">
                        {selectedTemplate.understand.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-primary" />
                        <h4 className="font-medium text-sm">Practice</h4>
                      </div>
                      <ul className="space-y-1">
                        {selectedTemplate.practice.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">{idx + 1}.</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-sm mb-2">Framework Structure</h4>
                      <p className="text-xs text-muted-foreground">
                        This template includes {countNodes(selectedTemplate.framework)} pre-configured nodes 
                        organized in a hierarchical structure ready for your analysis.
                      </p>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <Button 
                    className="w-full" 
                    onClick={() => handleUseTemplate(selectedTemplate)}
                    disabled={loading}
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Use This Template
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <div>
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Select a Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on a template to see details and preview the framework structure
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function countNodes(node: { children?: unknown[] }): number {
  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child as { children?: unknown[] });
    }
  }
  return count;
}

export default TemplateBrowserDialog;
