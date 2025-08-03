import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Grid3X3, List, Star, ThumbsUp, LayoutTemplate } from "lucide-react";
import TemplateCard from "@/components/templates/template-card";
import type { Template } from "@shared/schema";

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const categories = [
    { id: "all", name: "All Templates", count: 69 },
    { id: "research", name: "Research & Analysis", count: 12 },
    { id: "content", name: "Content Creation", count: 18 },
    { id: "customer", name: "Customer Support", count: 8 },
    { id: "sales", name: "Sales & Marketing", count: 15 },
    { id: "financial", name: "Financial Analysis", count: 6 },
    { id: "development", name: "Development", count: 10 }
  ];

  const featuredTemplates = [
    {
      id: "content-creation",
      title: "Content Creation Templates",
      description: "Blog posts, social media, and marketing content",
      count: "18 templates available",
      featured: true,
      category: "content",
      icon: "📝"
    }
  ];

  const stats = [
    { label: "Total Templates", value: "69", icon: LayoutTemplate },
    { label: "Featured", value: "4", icon: Star },
    { label: "Categories", value: "6", icon: Grid3X3 },
    { label: "Avg Rating", value: "4.8", icon: ThumbsUp }
  ];

  const filteredTemplates = templates?.filter((template: Template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 animate-pulse" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Ready-to-Use Crew Templates
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Jumpstart your AI projects with professionally crafted crew templates. From research and content creation to customer support and analytics.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create New Crew
        </Button>
      </div>

      {/* Category Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="flex flex-col items-center space-y-2 h-auto p-4"
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="text-lg">{category.id === "all" ? "🔍" : getCategoryIcon(category.id)}</div>
            <div className="text-center">
              <div className="font-medium text-sm">{category.name}</div>
              <div className="text-xs text-slate-500">{category.count} templates</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Featured Section */}
      {selectedCategory === "all" && (
        <div className="space-y-4">
          {featuredTemplates.map((featured) => (
            <Card key={featured.id} className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                      {featured.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {featured.title}
                        </h3>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          ⭐ Featured Category
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {featured.description}
                      </p>
                      <p className="text-sm text-primary font-medium mt-2">
                        {featured.count}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(featured.category)}
                  >
                    Explore Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{stat.value}</p>
                </div>
                <stat.icon className="w-5 h-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search templates by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most-popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredTemplates?.length || 0} of {templates?.length || 0} templates
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">🔥 Trending templates</span>
        </div>
      </div>

      {/* Templates Grid */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredTemplates?.map((template: Template) => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            viewMode={viewMode}
          />
        ))}
      </div>

      {filteredTemplates?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            No templates found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search criteria or browse different categories
          </p>
        </div>
      )}
    </div>
  );
}

function getCategoryIcon(categoryId: string) {
  const icons: Record<string, string> = {
    research: "🔍",
    content: "📝",
    customer: "💬",
    sales: "💰",
    financial: "📊",
    development: "🛠️"
  };
  return icons[categoryId] || "📋";
}