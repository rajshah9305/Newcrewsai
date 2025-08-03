import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Template } from "@shared/schema";

interface TemplateCardProps {
  template: Template;
  viewMode?: "grid" | "list";
}

export default function TemplateCard({ template, viewMode = "grid" }: TemplateCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loadTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/templates/load/${id}`, {});
      return response.json();
    },
    onSuccess: (configuration) => {
      toast({
        title: "Template Loaded",
        description: `${template.name} has been loaded successfully!`,
      });
      // In a real implementation, this would populate the agent/task forms
      console.log("Template configuration:", configuration);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "research":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "marketing":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "development":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "data science":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const handleLoadTemplate = () => {
    loadTemplateMutation.mutate(template.id);
  };

  const handlePreview = () => {
    // In a real implementation, this would open a modal with template details
    toast({
      title: "Preview",
      description: `Previewing ${template.name}`,
    });
  };

  const formatDownloads = (downloads: number) => {
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}k`;
    }
    return downloads.toString();
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{template.name}</h3>
              {template.featured && (
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
              {template.category}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-slate-600 dark:text-slate-400">{template.rating}</span>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">{template.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Agents</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {template.configuration?.agents?.length || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Tasks</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {template.configuration?.tasks?.length || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Downloads</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {formatDownloads(template.downloads)}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          By {template.author} • Updated {new Date(template.updatedAt!).toLocaleDateString()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            className="flex-1"
            onClick={handleLoadTemplate}
            disabled={loadTemplateMutation.isPending}
          >
            {loadTemplateMutation.isPending ? "Loading..." : "Load Template"}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
