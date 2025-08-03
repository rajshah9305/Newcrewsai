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
  Settings
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
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0 transform transition-transform duration-200 ease-in-out z-30",
          "lg:translate-x-0 lg:static lg:inset-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="gradient-bg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CrewAI</h1>
              <p className="text-blue-100 text-sm">Dashboard Pro</p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="px-6 py-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full pulse-dot" />
            <span className="text-sm text-slate-300">System Online</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.id} href={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start space-x-3 h-10 text-left font-normal",
                    "hover:bg-slate-800 transition-colors",
                    isActive && "bg-slate-800 text-white"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badgeVariant}
                      className="ml-auto text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Alex Chen</p>
              <p className="text-xs text-slate-400">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
