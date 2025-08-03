import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, Search, User } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-card/95 backdrop-blur-xl border-b border-border/50 px-6 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
            <p className="text-muted-foreground font-medium">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent/50 transition-all duration-200 focus-ring"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 focus-ring group"
          >
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs font-semibold animate-pulse"
            >
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 focus-ring group"
          >
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </Button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3 pl-3 border-l border-border/50">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <User className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
