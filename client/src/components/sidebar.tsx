import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  LayoutTemplate, 
  PlayCircle, 
  BarChart3, 
  Folder, 
  Menu, 
  X, 
  User,
  Play,
  Settings,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/", badge: "3", badgeVariant: "success" as const },
    { id: "crews", label: "My Crews", icon: Users, path: "/crews", badge: "6", badgeVariant: "secondary" as const },
    { id: "templates", label: "Templates", icon: LayoutTemplate, path: "/templates", badge: "69", badgeVariant: "secondary" as const },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
    { id: "live-preview", label: "Live Preview", icon: Play, path: "/live-preview" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 glass-effect"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "w-72 bg-sidebar text-sidebar-foreground flex flex-col fixed inset-y-0 left-0 transform transition-all duration-300 ease-out z-30",
          "lg:translate-x-0 lg:static lg:inset-0",
          "border-r border-sidebar-border shadow-xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="gradient-bg p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/95 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CrewAI</h1>
              <p className="text-white/80 text-sm font-medium">Dashboard Pro</p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent/50">
            <div className="w-3 h-3 bg-green-400 rounded-full pulse-dot shadow-lg shadow-green-400/50" />
            <span className="text-sm font-medium text-sidebar-foreground">System Online</span>
            <div className="ml-auto w-2 h-2 bg-green-400/50 rounded-full" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 custom-scrollbar overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.id} href={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start space-x-3 h-12 text-left font-medium rounded-xl transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
                    "focus-ring group relative",
                    isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "scale-110"
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badgeVariant}
                      className={cn(
                        "ml-auto text-xs font-semibold transition-all duration-200",
                        isActive && "bg-white/20 text-white"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className={cn(
                    "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200",
                    isActive && "opacity-100"
                  )} />
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-sidebar-border">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-all duration-200 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">Alex Chen</p>
              <p className="text-xs text-sidebar-foreground/70 font-medium">Pro Plan</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
        </div>
      </div>
    </>
  );
}
